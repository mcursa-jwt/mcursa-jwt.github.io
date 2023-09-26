Title: Solving connection pooling and 2006
Date: 2023-08-29 22:12
Category: Dev
Tags: dev, mysql, db

# overriding `dj_db_conn_pool`'s `ensure_connection()` method with pre-ping and timer

We use [dj_db_conn_pool](https://pypi.org/project/django-db-connection-pool/) as a simple way to pool connections in case of a surge in transactions initiated by client loads.

We were having trouble tweaking the library's parameters in [the next section](#understanding-the-issue) to stop the [mysql 2006 error](https://dev.mysql.com/doc/refman/8.0/en/gone-away.html) ([stackoverflow](https://stackoverflow.com/questions/26958592/django-after-upgrade-mysql-server-has-gone-away)) from occurring on our process scheduling module's queries.


### the fix: [adding a ping (that has exception handling upon failure).](https://aber.sh/articles/Django-automatic-reconnect/)
This solves the problem for now - and still maintains pooling functionality.
<!-- add logs to show still works -->

```py
from dj_db_conn_pool.backends.mysql import base
from django.db.backends.utils import CursorWrapper
class DatabaseWrapper(base.DatabaseWrapper):
    """
    inherits dj_db_conn_pool.backends.mysql.base.DatabaseWrapper

    overrides ensure_connection to add pre-ping regardless
    of connection freshness (`sqlalchemy.pool.base._ConnectionFairy._checkout` function)
    """
    def ensure_connection(self) -> None:
        """
        wrapper references:
        ---
            - `type(self.connection)==sqlalchemy.pool.base._ConnectionFairy`
            - `type(self.connection.connection)==_mysql.connection`
        """
        if self.connection is not None:
            try:
                logger.debug(f"ensuring existing connection {self.connection.connection} with pre-ping.")
                with CursorWrapper(self.create_cursor(), self) as cursor:
                    cursor.execute("SELECT 1")
                return
            except:
                logger.exception(f"unable to ensure existing connection {self.connection.connection}, creating new.")
        
        with self.wrap_database_errors:
            self.connect()
```
I still don't really like that it sends an extra pre-ping for each.

I couldnt find a similar issue online, with `dj_db_conn_pool` and `apscheduler`. 
Didn't the `sqlalchemy`/`django`/`dj_db_conn_pool` libraries implement a pre-ping? Turns out they did.

# understanding the issue (WIP)
we use [`apscheduler`](https://apscheduler.readthedocs.io/en/3.x/) library to schedule our jobs. so far, the issue occurs mostly on scheduled job's db transactions.

initially, the 2006 errors almost only occurred on the queries I was using to flag the execution status of jobs. After I removed that, it occured on jobs (-- my lead did mention that they might open a connection per thread)

**hypo:**
the same connection might have been referenced for later use, but connection has either been disconnected from the mysql server or by the parameters set.

the important parameters (and their references):

`Pool` (sqlalchemy/pool/base.py)
```python
class Pool(log.Identified, event.EventTarget):
    ...
    def __init__(
        ...
        def __init__(
        # self,
        # creator: Union[_CreatorFnType, _CreatorWRecFnType],
        recycle: int = -1,
        # echo: log._EchoFlagType = None,
        # logging_name: Optional[str] = None,
        # reset_on_return: _ResetStyleArgType = True,
        # events: Optional[List[Tuple[_ListenerFnType, str]]] = None,
        # dialect: Optional[Union[_ConnDialect, Dialect]] = None,
        pre_ping: bool = False,
        # _dispatch: Optional[_DispatchCommon[Pool]] = None,
    )
        ...
        ):
        """
        :param recycle: If set to a value other than -1, number of
              seconds between connection recycling, which means upon
              checkout, if this timeout is surpassed the connection will be
              closed and replaced with a newly opened connection. Defaults to -1.
        :param pre_ping: if True, the pool will emit a "ping" (typically
             "SELECT 1", but is dialect-specific) on the connection
             upon checkout, to test if the connection is alive or not.   If not,
             the connection is transparently re-connected and upon success, all
             other pooled connections established prior to that timestamp are
             invalidated.     Requires that a dialect is passed as well to
             interpret the disconnection error.
        """
```


`QueuePool` (sqlalchemy/pool/impl.py)
```python
class QueuePool(Pool):
    def __init__(
        self,
        creator: Union[_CreatorFnType, _CreatorWRecFnType],
        pool_size: int = 5,
        max_overflow: int = 10,
        timeout: float = 30.0,
        use_lifo: bool = False,
        **kw: Any,
    ):
        r"""
        :param timeout: The number of seconds to wait before giving up
          on returning a connection. Defaults to 30.0. This can be a float
          but is subject to the limitations of Python time functions which
          may not be reliable in the tens of milliseconds.
          """
```

implementation: dj_db_conn_pool.core.mixins.PooledDatabaseWrapperMixin.get_new_connection()

Error was being thrown on connection fairy's _checkout method

