pipeline {
    agent any

    tools {nodejs "20"}

    environment {
        DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1204375617710071899/mJoYhxvtHK0KOokOMKRHiz_gI3XuhjfmfPmdQ2kXzc5uKxZCINAKjqao8x2qrpzdZWMq"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out the code...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                sh 'npm install'
            }
        }

        stage('Build Application') {
            steps {
                echo 'Building the Angular app...'
                sh 'npm run build'
            }
        }
    }

    post {
        success {
            script {
                def payload = [
                    content: "✅ ${env.JOB_NAME} - Build #${env.BUILD_NUMBER} Succeeded!"
                ]
                def json = groovy.json.JsonOutput.toJson(payload)
                sh "curl -X POST -H 'Content-Type: application/json' -d '${json}' ${env.DISCORD_WEBHOOK_URL}"
            }
        }
        failure {
            script {
                def payload = [
                    content: "❌ ${env.JOB_NAME} - Build #${env.BUILD_NUMBER} Failed!"
                ]
                def json = groovy.json.JsonOutput.toJson(payload)
                sh "curl -X POST -H 'Content-Type: application/json' -d '${json}' ${env.DISCORD_WEBHOOK_URL}"
            }
        }
    }
}
