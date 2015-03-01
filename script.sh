sudo apt-get update
sudo apt-get install -y default-jre
sudo apt-get install -y wget git curl
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install -y nodejs
wget https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-1.9.8-linux-i686.tar.bz2
mkdir phantomjs
tar -xjf phantomjs-1.9.8-linux-i686.tar.bz2 -C phantomjs --strip-components=1
sudo ln -s /home/vagrant/phantomjs/bin/phantomjs /usr/bin/phantomjs
wget http://mirrors.jenkins-ci.org/war/latest/jenkins.war
java -jar jenkins.war --httpPort=8080