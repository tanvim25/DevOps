#Devops Project
Aniket Lawande (Unity ID- aglawand) ,
Tanvi Pravin Mainkar(Unity ID-  tmainka )

----------

We have developed a web application using Html, css and JavaScript. The web server is implemented using **Nodejs** and **Express** frameworks.
We are using **npm** for dependency management and **grunt** for managing various  build tasks. 

**Jenkins** is running on virtual machines managed by vagrant, one of which is a master and other is a slave.

## Build Details
#### Git hook:
 We have a local git repository setup, which has a commit hook on the 'develop' branch to run a Jenkins build. We have added a post-commit hook inside .git folder whose contents are as mentioned below:

    if [ `git rev-parse --abbrev-ref HEAD` == "develop" ]; then
		 curl http://localhost:8080/job/DevOps/build
	fi

By initiating a GET request to this url, Jenkins will initiate a build on the devops job.

#### Job configurations:
We have configured this job to perform followng commands:

1. Clone from local git repository(Git plugin).
2. Install packages using npm.
3. Run build tasks using grunt.

    
        cd $WORKSPACE
    	npm install
        node node_modules/grunt-cli/bin/grunt


npm installs all the dependencies that are required to setup this project. 

Grunt tasks are written so as to first clean-up all the old files that may   be present in the current workspace. Next they translate less files to css and js files to minified js.
 
#### Master slave configuration:
We have configured the master node in Jenkins to delegate tasks to a slave node so that slave is able to run a build on the project from clean state.
![Master-Config](https://raw.githubusercontent.com/tanvim25/DevOps/master/pics/Master-Slave.jpg)


![Slave](https://raw.githubusercontent.com/tanvim25/DevOps/master/pics/Slave.jpg)

#### Build report:
The build reports are available through following url:
http://localhost:8080/job/DevOps/1/

[Example output](https://raw.githubusercontent.com/tanvim25/DevOps/master/jenkins.out)

![Build output](https://raw.githubusercontent.com/tanvim25/DevOps/master/pics/Build.jpg)
