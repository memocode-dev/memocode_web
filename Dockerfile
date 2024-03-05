# 실행 단계
FROM nginx:1.25.3

# 이미 빌드된 애플리케이션 파일들을 Nginx 서버의 서빙 디렉토리로 복사합니다.
# 이 경로는 빌드된 파일들이 위치한 로컬 디렉토리를 가리켜야 합니다.
COPY ./dist /usr/share/nginx/html

# 기본 nginx 설정 파일을 삭제합니다. (custom 설정과 충돌 방지)
RUN rm /etc/nginx/conf.d/default.conf

# custom 설정 파일을 컨테이너 내부로 복사합니다.
COPY infra/nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]