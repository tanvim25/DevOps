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
We have configured this job to perform following commands:

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


## Test
#### Unit testing - Jasmine
For unit testing our javascript code, we are using the [jasmine](http://jasmine.github.io/edge/introduction.html) test framework. Writing tests in javascript and running them using a combination of *grunt* and *phantomjs*. The phantomjs environment allows for automated headless execution of javascript.

We are testing against the [trie](https://github.com/tanvim25/DevOps/blob/master/public/MyTrie/trie.js) library as well as the main application code that uses it.

A grunt task has been written which executes jasmine test cases using phantomjs.
```javascsript
src : ['public/MyTrie/trie.js', 'public/main.js'],
options: {
	vendor: ['public/lib/angular.min.js', 'test/jasmine-2.1.3/angular-mocks.js', 'public/MyTrie/trie-browser.js'],
	// Your Jasmine spec files
	specs : 'test/autocomplete.js',
},
```

#### Coverage - Istanbul
To provide coverage reports over the code, we are using [istanbul](https://github.com/gotwarlost/istanbul).
It provides statement, function and branch coverage and works with jasmine.

We have extended the jasmine task to include coverage by istanbul
```javascript
istanbul: {
	src: '<%= jasmine.all.src %>',
	options: {
		vendor: '<%= jasmine.all.options.vendor %>',
		specs: '<%= jasmine.all.options.specs %>',
		template: require('grunt-template-jasmine-istanbul'),
		templateOptions: {
			coverage: 'coverage/json/coverage.json',
			report: [
				{type: 'html', options: {dir: 'coverage/html'}},
				{type: 'text-summary'},
				{type: 'json-summary'}
			]
		}
	}
},
```

*Sample output*

![Coverage output](https://raw.githubusercontent.com/tanvim25/DevOps/master/pics/Coverage.jpg)

#### Fuzzing
To improve testing coverage with automation we used fuzzing. We implemented this by taking the initial seed of strings stored in the autocomplete data structure and fuzzing (mutating) them in random ways. The mutated strings were then provided as inputs to the tests. This approach improved the coverage count significantly as many paths that weren't covered before began to be visited now. Tests begin to fail to randomly because of fuzzed input, the output is not deterministic anymore.

[Fuzzing test cases](https://github.com/tanvim25/DevOps/blob/master/test/test-fuzzing.js)

![Fuzzing Coverage output](https://raw.githubusercontent.com/tanvim25/DevOps/master/pics/Fuzzing%20Coverage.png)

## Git Hooks
The hooks are in the [gitHooks](https://github.com/tanvim25/DevOps/tree/master/gitHooks) directory. To copy the hooks to the .git/ directory, copy them manually or run the following command
```script
grunt initHooks
```

#### Pre-commit
A precommit hook prevents a commit from taking place based on some criteria. In our project we have used the unit test outputs by *jasmine*, coverage by *istanbul* and static code anaylsis by *pmd* to decide criteria for rejection of the commit. The scripts to anaylse the coverage and analysis reports are in the gitHooks directory as well. They are invoked by the pre-commit script and their exit code determines the success/failure of the pre-commit process.

[Pre-commit hook](https://github.com/tanvim25/DevOps/blob/master/gitHooks/pre-commit)

#### Post-commit
There is a simple post-commit hook to check if the current branch is the develop branch and to initiate a GET request to the local jenkins url for the project so that a build will be triggered.

[Post-commit hook](https://github.com/tanvim25/DevOps/blob/master/gitHooks/post-commit)

##Analysis
#### Integration with Static Analysis Tool: ###

We have integrated our application with [PMD](http://pmd.sourceforge.net/), which is a source code analyzer designed to run static analysis on the source code provided. 
We are using PMD to run static analysis on the JavaScript code present in our application. The files which are analyzed by PMD are:


- /public/main.js
- /public/MyTrie/trie.js


#### Customizing rule set: ###
PMD provides default rule sets which can be used to analyze your application's source code. We have selected the rules which are more relevant to our application. Also some of the rules have been modified to better suit our requirements. eg. We have reduced the priority of the rule "GlobalVariable" to 3 and customized the error message.

    <rule
		ref="rulesets/ecmascript/basic.xml/GlobalVariable"
		message="Use of global variables should be avoided">
		<priority>3</priority>
	</rule>

We have also added a new rule using XPath which checks that number of arguments passed to the function Trie() are no less than 2.

    	<![CDATA[
		//FunctionCall/Name[
		 @Image = 'Trie'
		 and
		 count(../*) <2
		]
		]]>

The new rule set containing above changes is defined in [Custom.xml](https://github.com/tanvim25/DevOps/custom.xml) file.
####Integration with Jenkins ###
We have configured the Jenkins job to run a PMD analysis on the checked-in code. The report is stored in an xml format in pmd.xml file.

    
	 ./public/lib/pmd-bin-5.2.3/bin/run.sh pmd -d $WORKSPACE/public/main.js,$WORKSPACE/public/MyTrie/trie.js -f xml -R rulesets/ecmascript/custom.xml -language javascript > pmd.xml

Jenkins has a [Static Analysis Collector PMD plugin](https://wiki.jenkins-ci.org/display/JENKINS/PMD+Plugin)  which analyzes the report generated (pmd.xml) generated and publishes the findings on  the GUI.

![PMD results](https://github.com/tanvim25/DevOps/blob/master/pics/pmd1.JPG)

![PMD results](https://github.com/tanvim25/DevOps/blob/master/pics/pmd2.JPG)

#### Rejecting a commit: ###
Using the PMD plug-in, we have configured our Devops job to fail if more than 1 high priority errors are reported by PMD. These values are configurable based on the priorities of the errors and warnings.

![Jenkins-PMD](https://github.com/tanvim25/DevOps/blob/master/pics/jenkins-gate.JPG)


##Deployment
We have used [Ansible](http://www.ansible.com/home) to configure the deployment environment.
The ansible is setup on a local VM where the build server also resides. We have added three seperate jobs in Jenkins- one job for our application, another job for the canary version of the application and third job for triggering Ansible. 

![Jenkins Job](https://github.com/tanvim25/DevOps/blob/master/pics/JenkinsJobs.JPG)

A post-build action is added to both application and canary jobs so as to trigger ansible job when the build is successful. Ansible job simply runs the playbook using the 
pem file.

    sudo ansible-playbook -u ubuntu $source/playbooks/deploy.yml --private-key $source/.ssh/Tanvi.pem 

###Automatic Deployment
We have deployed our application on three AWS EC2 instances.

1. [Proxy server](http://ec2-54-68-52-246.us-west-2.compute.amazonaws.com:3000/) 
2. [Application Server](http://ec2-52-10-3-226.us-west-2.compute.amazonaws.com:3000) 
3. [Canary Server](http://ec2-54-148-142-135.us-west-2.compute.amazonaws.com:3000) 

We have written an ansible playbook called [deploy.yml](https://github.com/tanvim25/DevOps/blob/master/deploy.yml) which configures these instances with software required to run the application. The project files are copied from ansible master to these aws instances and node processes are started using [forever](https://www.npmjs.com/package/forever). 
Please note that only the code and libraries which are necessary to run the application are copied onto the deployment servers. Rest of the dev dependencies are not copied.

The application code is deployed on both the proxy server and the application server, while the canary version is deployed on the canary server. It is the job of proxy server to redirect every third user to the canary server and rest of the requests to the application server.
 
##Canary
The canary version of the application has experimental features that we do not wish to roll out to all users at the same time. Specifically we have moved the client side autocomplete to server side.

To facilitate a selective rollout, the [infrastructure](https://github.com/tanvim25/DevOps/blob/master/infrastructure.js) module redirects every 3rd user to the canary using user sessions. To aid with testing, if the flag *forceCanary* is *true* in the request cookies, this will force a redirect to the canary application.

#### Canary Monitoring
We are monitoring 2 metrics of the canary version of the application
* Server errors
* Response time of lookup
To demonstrate, we are randomly introducing errors and increasing lookup response times.

The status of the canary can be view on the [status page](http://ec2-54-68-52-246.us-west-2.compute.amazonaws.com:3000/infra/)
![Status Page](https://raw.githubusercontent.com/tanvim25/DevOps/master/pics/Canary%20Status.jpg)

If the canary reports any errors, the infrastructure server stops routing to the canary and only routes to the main application.

## Special Milestone
The purpose of our special milestone was to extend the canary version of our application to log ot only server side errors but also client side Javascript errors.

This was achieved using PhantomJs - a headless browser process - to spawn ghost clients everytime a user was served a canary version of the application. The ghost version of the application would request for the same page the client requested for and also be notified of when the real client performs user actions. This is so that whenever the client gets an error due to some user action, the ghost should get the same error as well.

#### Implementation
PhantomJs was deployed on a separate node controlled by a simple NodeJs server. This node is only accessible to the infrastructure node. PhantomJs is driven via a Node-Phantom [bridge](https://github.com/sgentle/phantomjs-node). The node server receives commands (like start, event) from the infrastructure node and uses them to drive the PhantomJs instance.

On the cient, along with every page, additional javascript is served by the canary to enable event capturing and forwarding. This is done using simple event listeners on the body and making Ajax requests to the infrastructure node with the event information. The infrastructure node merely forwards the event to the ghost.

When there is an error on the client, there will be an identical error on the ghost as well. The errors can be logged and reported.
