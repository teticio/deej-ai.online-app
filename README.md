# Deej-A.I. React App  ![Build Status](https://github.com/teticio/deej-ai.online-app/actions/workflows/build.yaml/badge.svg) [![StackShare](http://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](https://stackshare.io/teticio/deej-a-i)

This is the source code for my webpage which is hosted at https://deej-ai.online/. If you are interested in the deep learning models that are used in the backend, have a look at my other repo https://github.com/teticio/Deej-A.I./.

![Deej-A.I.](screenshot.png)

---
## Technical features

* FastAPI backend server that handles calls to TensorFlow deep learning models, serves web content, manages the database (SQL, SQLite, etc.) and takes care of the Spotify authentication flow.
* Dockerized for reproducibility.
* Scalable and highly available Kubernetes deployment which is easy to install on a cloud or bare metal server using Helm.
* SSL certificates for HTTPS connections provisioned automatically using Let's Encrypt.
* Responsive ReactJS frontend web app and React Native app for iOS and Android using common codebase.
* Client-side caching with service workers and server-side caching using Redis.
* PWA (Progressive Web App) that can be installed on the desktop.
* Automated unit tests and linting with Travis CI and / or GitHub Actions.

---
## Installation

In order to run this, you will need to create a `credentials.py` file in the `backend` directory with your Spotify Developer API credentials, which can be obtained from https://developer.spotify.com/dashboard/login.

```
CLIENT_ID = '<Your client ID>'
CLIENT_SECRET = '<Your secret>'
REDIRECT_URI = '<Your external webpage URL>/api/v1/callback'
```

You will also need to download the following files to the root directory:

* https://drive.google.com/file/d/1geEALPQTRBNUvkpI08B-oN4vsIiDTb5I/view?usp=sharing
* https://drive.google.com/file/d/1Mg924qqF3iDgVW5w34m6Zaki5fNBdfSy/view?usp=sharing
* https://drive.google.com/file/d/16JKjDGW2BMP-0KKJLFvwRvJdKhwukBeB/view?usp=sharing
* https://drive.google.com/file/d/1tLT_wmATWMC5UU-kERLsUNNcz0Vo19J3/view?usp=sharing
* https://drive.google.com/file/d/1LM1WW1GCGKeFD1AAHS8ijNwahqH4r4xV/view?usp=sharing

The easiest way to do this is by running `python download.py`. You should also set `REACT_APP_API_URL` to `'<Your external webpage URL>/api/v1'` in `.env.production` and `APP_URL` to `<Your external webpage URL>` in `run.sh`.

If you want to avoid having to install Redis for caching requests, you should set the environment variable `NO_CACHE`. Assuming you have `pipenv` and `yarn` already installed, you can type
```
./install.sh
```
and
```
./run.sh
```
(In Windows, you will either have to run these commands in a Git Bash shell or adapt the scripts as appropriate). As a final step, you can then set up a reverse proxy to `http://localhost:8000/`.

## Deployment on a Kubernetes cluster with Helm

![Deej-A.I.](architecture.png)

To build the Docker image, run
```
./build_docker.sh
```
You will need to have already created your `credentials.py`, as explained above. To install the Helm chart type
```
./install_helm.sh
```
The scripts assume you are running a `minikube`. This will install the backend FastAPI server, an SQL database to store the playlists and a Redis instance to cache server side static requests. To install on an AWS cluster with Kops
```
./deploy_kops.sh <Your external webpage domain>
```
provided your domain is hosted by Route 53 and you have configured the [DNS, S3 and IAM settings](https://aws.amazon.com/blogs/compute/kubernetes-clusters-aws-kops/) appropriately to run Kops. If everything has gone to plan,
```
kubectl get svc -n deejai
```
will return an external IP for the Elastic Load Balancer (ELB). You will need to point your domain to the ELB by editing the relevant A record for your hosted zone in the AWS console. It will then automatically provision an SSL certificate for HTTPS connections.

## React Native

<img src="screenshot2.png" alt="Deej-A.I." style="width:49%;"/> <img src="screenshot3.png" alt="Deej-A.I." style="width:49%;"/>

ReactJS and React Native are very similar but quite different at the same time. I wanted to avoid duplicating code as much as possible (following the DRY - Don't Repeat Yourself - principle) so I have wrapped the platform specific code in `Platform.js` and `Platform.native.js`. In particular, the standard HTML tags like `<h1>` or `<a>` have been replaced with wrapper components (e.g., `Text` and `Link`). To run on iOS or Android using Expo type
```
yarn start-native
```
You can build an APK or IPA if you have an Expo account with
```
expo build:android
```
or
```
expo build:ios
```
## Tech stack
<div style="display: flex; flex-wrap: wrap">
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/1209/javascript.jpeg"></div>
		<div>JavaScript</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/993/pUBY5pVj.png"></div>
		<div>Python</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/1020/OYIaJ1KK.png"></div>
		<div>React</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/1025/logo-mysql-170x170.png"></div>
		<div>MySQL</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/1101/C9QJ7V3X.png"></div>
		<div>Bootstrap</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/1031/redis.png"></div>
		<div>Redis</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/2699/KoK6gHzp.jpg"></div>
		<div>React Native</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/1071/sqlite.jpg"></div>
		<div>SQLite</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/3350/8261421.png"></div>
		<div>React Router</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/1839/q5uAkmy7.png"></div>
		<div>SQLAlchemy</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/5795/FLrIEeNN.jpg"></div>
		<div>Expo</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/25014/default_f6ff39141b468e832d1bc59fc98a060df604d44d.png"></div>
		<div>FastAPI</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/5227/n6FsWiMQ.png"></div>
		<div>Bootswatch</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/12834/uvicorn.png"></div>
		<div>Uvicorn</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/4717/FtFnqC38_400x400.png"></div>
		<div>TensorFlow</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/5601/keras.png"></div>
		<div>Keras</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/6422/react-navigation.png"></div>
		<div>React Navigation</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/8731/17571969.png"></div>
		<div>React Native Paper</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/27/sBsvBbjY.png"></div>
		<div>GitHub</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/586/n4u37v9t_400x400.png"></div>
		<div>Docker</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/4202/Visual_Studio_Code_logo.png"></div>
		<div>Visual Studio Code</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/1885/21_d3cvM.png"></div>
		<div>Kubernetes</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/1682/IMG_4636.PNG"></div>
		<div>Webpack</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/3337/Q4L7Jncy.jpg"></div>
		<div>ESLint</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/2739/-1wfGjNw.png"></div>
		<div>Babel</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/5848/44mC-kJ3.jpg"></div>
		<div>Yarn</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/460/Lu6cGu0z_400x400.png"></div>
		<div>Travis CI</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/830/jest.png"></div>
		<div>Jest</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/11563/actions.png"></div>
		<div>GitHub Actions</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/5983/AHcBc6EG_400x400.jpg"></div>
		<div>Helm</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/4586/Lu99Qe0Z_400x400.png"></div>
		<div>pytest</div>
	</div>
	<div style="padding: 5px 5px; width: 100px">
		<div><img src="https://img.stackshare.io/service/4837/py.jpg"></div>
		<div>Pylint</div>
	</div>
</div>
