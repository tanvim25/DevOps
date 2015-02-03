sudo apt-get update
sudo apt-get install -y default-jre
sudo apt-get install -y wget
wget http://mirrors.jenkins-ci.org/war/latest/jenkins.war
java -jar jenkins.war --httpPort=8080