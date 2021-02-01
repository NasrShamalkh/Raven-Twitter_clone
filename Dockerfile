# A docker image containing python3.9 and node 14.15.4 from docker user "nikolaik"
# Base image link (https://hub.docker.com/r/nikolaik/python-nodejs)
FROM nikolaik/python-nodejs:python3.9-nodejs14
ENV PYTHONUNBUFFERED 1
WORKDIR /app
# copying requirements.txt and installing them using pip
COPY requirements.txt ./
RUN pip install -r requirements.txt
# copying the rest of the files with the client directory
COPY . ./
# it would be complicated to make another Dockerfsile for the client 
# because the clinet code is integrated in the python code 
# and they both depend on each other (Did not see that coming with this structure ! :))
# package.json is already in the client alongside the resto of the files
RUN cd client && npm install && npm run build && cd ..
RUN python manage.py makemigrations && python manage.py migrate
EXPOSE 8000
