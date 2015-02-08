#Devops Project

We have developed a web application using html, css and javascript. The web server is implemented using nodejs and express framework.
We are using npm for dependency management and grunt for managing the build tasks. 

Jenkins is running on virtual machines, one of which is a master and other is a slave.
 
## Build Section
 We have a local git repository setup with a commit hook on the 'develop' branch to run a Jenkins build. To achieve this, we have added a post-commit hook inside .git folder whose contents are as mentioned below:

```shell
if [ `git rev-parse --abbrev-ref HEAD` == "develop" ]; then
   curl http://localhost:8080/job/DevOps/build
fi
```

By hitting this url, Jenkins will initiate a build on the devops job.

We have configured this job to:

1. Clone from local git repository.
2. Install packages using npm.
3. Run build tasks using grunt.

```shell
cd $WORKSPACE
npm install
node node_modules/grunt-cli/bin/grunt
```

We configured the master node in Jenkins to delegate tasks to a slave node.
![Master-Config](https://raw.githubusercontent.com/tanvim25/DevOps/master/pics/Master-Slave.jpg)
![Slave](https://raw.githubusercontent.com/tanvim25/DevOps/master/pics/Slave.jpg)

The build reports are available through following url:
http://localhost:8080/job/DevOps/1/

[Example output](https://raw.githubusercontent.com/tanvim25/DevOps/master/jenkins.out)
![Build output](https://raw.githubusercontent.com/tanvim25/DevOps/master/pics/Build.jpg)
