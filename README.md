# IPFS Pinning service 

Runs on AWS. Accepts a signed hash to start pinning. 

TODO: send node data as well



### Ubuntu Server 16.04 on AWS Requirements 
```

sudo apt-get install python2.7 build-essential g++
sudo ln -s /usr/bin/python2.7 /usr/bin/python

sudo apt-get install golang-go -y

cd ~
wget https://dist.ipfs.io/go-ipfs/v0.4.13/go-ipfs_v0.4.13_linux-amd64.tar.gz
tar xvfz go-ipfs_v0.4.13_linux-amd64.tar.gz
cd go-ipfs
sudo ./install

cd ~
git clone https://github.com/secondai/ipfs_pin_server.git
cd ipfs_pin_server
yarn install
yarn add global babel-cli

npm run server:build

npm run server:start

```