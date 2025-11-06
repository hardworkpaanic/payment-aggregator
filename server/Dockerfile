FROM redis:7.2-alpine

# Копируем кастомную конфигурацию если нужно
# COPY redis.conf /etc/redis/redis.conf

RUN mkdir -p /data && chown redis:redis /data

EXPOSE 6379

CMD ["redis-server"]