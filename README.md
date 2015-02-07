#Devops Project

We have developed a web application using html, css and javascript. The web server is implemented using nodejs and express framework.
We are using npm for dependency management and grunt for managing the build tasks. 

Jenkins is running on virtual machines, one of which is a master and other is a slave.
 
## Build Section
 We have a local git repository setup with a commit hook on the 'develop' branch to run a Jenkins build. To achieve this, we have added a post-commit hook inside .git folder whose contents are as mentioned below:

--code--

By hitting this url, Jenkins will initiate a build on the devops job.

We have configured this job to:

1. Clone from local git repository.
2. Install packages using npm.
3. Run build tasks using grunt.

--code--

    cd $WORKSPACE
	npm install
	node node_modules/grunt-cli/bin/grunt

We configured the master node in Jenkins to delegate tasks to a slave node. 

The build reports are available through following urls:
