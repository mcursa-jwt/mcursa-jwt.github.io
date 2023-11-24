Title: Hosting a VPS on Hetzner
Date: 2023-10-28 00:15
Category: hosting
Tags: dev, hosting, cloud

# hetnzer cloud
Recently decided to try using [hetzner](https://community.hetzner.com/)'s cloudVPS to self-host applications/websites. mess around with fun new software without it being centred around my day job. 

The server is located somewhere in Germany

# setup steps i took
(these are for mostly my own reference)
  1. set up VM from hetzner portal
      - create ssh key and copy public key into portal
      - they support [cloud-init](https://cloudinit.readthedocs.io/en/latest/index.html) if you use it
      - created some private networks for future use
  1. ssh into public ip using "root@youraddress" (and your ssh passphrase if you have one)
      - if you didn't use your key and you didn't allow root on creation: [here's a helpful reddit thread](https://www.reddit.com/r/hetzner/comments/nfme1k/comment/gymhz82/?utm_source=share&utm_medium=web2x&context=3)
  1. installed [bash-powerline](https://github.com/riobard/bash-powerline) 
      - ```sh
        curl https://raw.githubusercontent.com/riobard/bash-powerline/master/bash-powerline.sh > ~/.bash-powerline. # sh Download the Bash script
        echo "source ~/.bash-powerline.sh" >> ~/.bashrc
        ```

## overall experience
I'd say it was pretty painless!
