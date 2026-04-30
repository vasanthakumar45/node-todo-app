pipeline {
    agent any

    environment {
        IMAGE_NAME = 'node-todo-app'
        IMAGE_TAG  = "v${BUILD_NUMBER}"
        CONTAINER_NAME = 'todo-app-container'
        PORT = '3000'
    }

    stages {

        stage('📥 Checkout') {
            steps {
                echo 'Cloning repository...'
                checkout scm
            }
        }

        stage('📦 Install Dependencies') {
            steps {
                echo 'Installing npm packages...'
                sh 'npm install'
            }
        }

        stage('🧪 Run Tests') {
            steps {
                echo 'Running unit tests...'
                sh 'npm test'
            }
        }

        stage('🐳 Build Docker Image') {
            steps {
                echo "Building Docker image: ${IMAGE_NAME}:${IMAGE_TAG}"
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest"
            }
        }

        stage('🚀 Deploy Container') {
            steps {
                echo 'Deploying application...'
                sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm   ${CONTAINER_NAME} || true
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p ${PORT}:3000 \
                        --restart unless-stopped \
                        ${IMAGE_NAME}:latest
                """
            }
        }

        stage('✅ Health Check') {
            steps {
                sleep(time: 5, unit: 'SECONDS')
                sh "curl -f http://localhost:${PORT}/ || exit 1"
                echo 'Application is healthy!'
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline SUCCESS — App running at http://localhost:${PORT}"
        }
        failure {
            echo '❌ Pipeline FAILED — Check logs above'
            sh "docker stop ${CONTAINER_NAME} || true"
        }
        always {
            echo "🧹 Cleaning up old Docker images..."
            sh "docker image prune -f"
        }
    }
}
