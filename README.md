# node-scraping
> This is my personal web crawling application.

I used the NestJS framework as the foundation to develop the application. I utilized the ELK stack for the frontend of the application. This project was launched in a Docker environment.

**Below is the image of architecture:**

[![The architecture of the applcation](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*wWOK0j2tEPI0sGf5xCsJpw.png "by Chunlin Wang")

### [Read the documentation ](https://medium.com/@kazami0083/node-web-crawling-and-elk-monitoring-801dfb18822e)

### How can I start this application ?
```shell
docker-compose up 
```

### How can I restart the crawling command ?

```shell
docker-compose up app 
```

### How can I run the scraping script without the docker env ?

Launch the application withour docker, we can just run the command 

```shell
pnpm i
pnpm cmd:crawler
```

## TOOLS
- [NestJs](https://nestjs.com/)
- [Crawlee](https://crawlee.dev/)
- [Docker](https://www.docker.com/)
- [ELK stack](https://www.elastic.co/elastic-stack)

## Environment Dev:
* Node >= 20
* ELK = 8.12

## Author
* [@Chunlin Wang](https://www.linkedin.com/in/chunlin-wang-b606b159/)