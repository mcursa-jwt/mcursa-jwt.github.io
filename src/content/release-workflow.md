Title: Releasing with git flow 
Date: 2023-08-18 16:27
Category: Dev
Tags: dev, devops, git

## Git flow + release notes template  (and building to gitlab)

## our release gitflow:
![release gitflow](../images/release_git_flow.png)
<br>
Learning to use the traditional [git flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

with each release, my team runs a period of staging, the length depending on urgency. During staging, bugfixes and tweaks (for this release) will be done on `release-fixes`. this will branch from `release`

After we are satisfied with the release candidate (rc), we will merge onto main for production release. In production, any urgent fixes will be done on the 'hotfix' branch. This will be the only branch to branch directly off `main`.

## generating release notes
this command will generate release notes using:
- commits from previous version tag to release version tag
- release notes template

```shell
VERSION='1.0.0';PREVIOUS_VERSION='1.0.0.rc'; CHANGES=$(git log --no-merges origin/release --pretty=oneline --format="1. %s [%H]%d" $VERSION...$PREVIOUS_VERSION); printf "# Image\n\`\`\`\ndocker image pull registry.gitlab.com/your/app_name:$VERSION # main server\ndocker image pull registry.gitlab.com/your/app_name:$VERSION.ocpp # ocpp server\n\`\`\` \n\n### Release Scope:\n\n### New features:\n\n### Notes:\n\n## Changes\n$CHANGES\n\n## Metadata\n\`\`\`\nThis version -------- $VERSION\nPrevious version ---- $PREVIOUS_VERSION\nTotal commits ------- $(echo "$CHANGES" | wc -l)\n\`\`\`\n" > /tmp/release_notes_$VERSION.md; 
vim /tmp/release_notes_$VERSION.md # can be any other text editor
```

edit the output file to include content for:
- image tags
- release scope
  - reason for release
  - feature rollout
  - bugfixes

We use release scopes that are sub-scopes of our current sprint

## building for release
first make sure you are in the right version (and folder repository)
```shell
app_name/$ git checkout -f 1.0.0
```

then build
```shell
sudo docker build -t registry.gitlab.com/your/app_name:1.0.0 . && sudo docker push registry.gitlab.com/your/app_name:1.0.0
sudo docker build -f ocpp.Dockerfile -t registry.gitlab.com/your/app_name:1.0.0.ocpp . && sudo docker push registry.gitlab.com/your/app_name:1.0.0.ocpp
```