pipeline {
	agent any

	tools {
		nodejs "nodejs-ilead"
	}

  stages {
    stage('jenkins test') {
      steps {
        echo 'Hello Jenkins!'
      }
    }
    stage('React install') {
      steps {
        sh 'npm i ./FE/ilead -g'
      }
    }
    stage('React build') {
      steps {
        sh 'npm run build --prefix FE/ilead'
      }
    }
    stage('Build nginx image') {
      steps {
        sh 'docker build -t basepage/nginx ./FE/ilead'
      }
    }
    stage('React Deploy') {
			steps{
				sh 'docker stop nginx && docker rm nginx'
				sh 'docker run --network ilead -d --name nginx -p 80:80 -p 443:443 -v /etc/letsencrypt:/etc/letsencrypt -u root basepage/nginx'
			}
		}
    // stage('Java version') {
		// 	steps{
		// 		sh 'java -version'
		// 	}
		// }
    // stage('Springboot Build') {
		// 	steps {
		// 		sh 'docker cp aws.yml jenkins:/var/jenkins_home/workspace/ILead/BE/src/main/resources'
		// 		dir('./BE/ILead'){
		// 			sh './gradlew build'
		// 		}
		// 	}
		// }
		// stage('Build Springboot image'){
		// 	steps {
		// 		sh 'docker build -t basepage/springboot ./BE'
		// 	}
		// }
		// stage('Springboot Deploy') {
		// 	steps {
		// 		sh 'docker stop springboot && docker rm springboot'
		// 		sh 'docker run --network ilead -d --name springboot -p 7777:7777 -v /etc/letsencrypt:/etc/letsencrypt -u root basepage/springboot'
		// 	}
		// }
  }
}