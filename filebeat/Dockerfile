FROM docker.elastic.co/beats/filebeat:8.12.2

USER root

COPY config/filebeat.yml /usr/share/filebeat/filebeat.yml

RUN chown root: /usr/share/filebeat/filebeat.yml

RUN chmod go+x /usr/share/filebeat/filebeat.yml

