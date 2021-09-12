# Deej-A.I. React App [![Build Status](https://app.travis-ci.com/teticio/deej-ai.online-app.svg?branch=main)](https://app.travis-ci.com/teticio/deej-ai.online-app)

![Deej-A.I.](screen_shot.png)

This is the source code for my webpage which is hosted at https://deej-ai.online/. If you are interested in the deep learning models that are used in the backend, have a look at my other repo https://github.com/teticio/Deej-A.I./.

In order to run this, you wil need to create a `credentials.py` file in the `backend` directory with your Spotify Developer API credentials, which can be obtained from https://developer.spotify.com/dashboard/login.

```
CLIENT_ID = '<Your client ID>'
CLIENT_SECRET = '<Your secret>'
REDIRECT_URI = '<Your external webpage URL>/api/v1/callback'
```

You will also need to download the following files to the root directory:

* https://drive.google.com/file/d/1geEALPQTRBNUvkpI08B-oN4vsIiDTb5I/view?usp=sharing
* https://drive.google.com/file/d/1Mg924qqF3iDgVW5w34m6Zaki5fNBdfSy/view?usp=sharing
* https://drive.google.com/file/d/16JKjDGW2BMP-0KKJLFvwRvJdKhwukBeB/view?usp=sharing
* https://drive.google.com/file/d/1LM1WW1GCGKeFD1AAHS8ijNwahqH4r4xV/view?usp=sharing

The easiest way to do this is by running `python download.py`. You should also set `REACT_APP_API_URL` to `'<Your external webpage URL>/api/v1'` in `.env.production` and `APP_URL` to `<Your external webpage URL>` in `run.sh`.

If you have `pipenv` and `yarn` already installed you can then type
```
./install.sh
```
and
```
./run.sh
```
(In Windows, you will either have to run these commands in a Git Bash shell or adapt the scripts as appropriate). As a final step, you can then set up a reverse proxy to `http://localhost:8000/`.

## Deployment on a Kubernetes cluster with Helm

To build the Docker image, run
```
./build_docker.sh
```
You will need to have already created your `credentials.py`, as explained above. To install the Helm chart type
```
./install_helm.sh
```
The scripts assume you are running a `minikube`. To install on an AWS cluster with Kops
```
./deploy_kops.sh <Your external webpage domain>
```
provided your domain is hosted by Route 53 and you have configured the [DNS, S3 and IAM settings](https://aws.amazon.com/blogs/compute/kubernetes-clusters-aws-kops/) appropriately to run Kops. If everything has gone to plan,
```
kubectl get svc -n deejai
```
will return an external IP for the Elastic Load Balancer (ELB). You will need to point your domain to the ELB by editing the relevant A record for your hosted zone in the AWS console.