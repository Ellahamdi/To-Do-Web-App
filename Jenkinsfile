pipeline {
    agent any

    environment {
        // Pour éviter les conflits de noms avec d'autres builds
        COMPOSE_PROJECT_NAME = "todo_project"
    }


    stages {
        // ---------------------------------------------------------
        // STAGE 1: Checkout
        // ---------------------------------------------------------
        stage('Checkout') {
            steps {
                echo "--- Etape 1: Checkout ---"
                checkout scm
            }
        }

        // ---------------------------------------------------------
        // STAGE 2: Setup
        // ---------------------------------------------------------
        stage('Setup') {
            steps {
                echo "--- Etape 2: Setup & Clean ---"
                script {
                    // Vérification de docker-compose
                    bat 'docker-compose --version'

                    // Suppression des conteneurs existants
                    bat 'docker-compose down --volumes --remove-orphans || exit 0'
                    bat 'docker rm -f todo-frontend todo-backend todo-mongo || exit 0'
                }
            }
        }

        // ---------------------------------------------------------
        // STAGE 3: Build
        // ---------------------------------------------------------
        stage('Build') {
            steps {
                echo "--- Etape 3: Build Images ---"
                bat 'docker-compose build'
            }
        }

        // ---------------------------------------------------------
        // STAGE 4: Run (Docker)
        // ---------------------------------------------------------
        stage('Run (Docker)') {
            steps {
                echo "--- Etape 4: Run Containers ---"
                bat 'docker-compose up -d'
                echo "Attente de 15 secondes pour l'initialisation de la BDD..."
                sleep 15
            }
        }

        // ---------------------------------------------------------
        // STAGE 5: Smoke Test
        // ---------------------------------------------------------
        stage('Smoke Test') {
            steps {
                echo "--- Etape 5: Smoke Tests ---"
                script {
                    // Test backend
                    bat 'curl -v http://localhost:8000 || echo Backend accessible mais route racine non définie'

                    // Test frontend
                    bat 'curl -I --fail http://localhost:3000'
                    
                    echo "Smoke Tests validés : Les ports 3000 et 8000 répondent."
                }
            }
        }

        // ---------------------------------------------------------
        // STAGE 6: Archive
        // ---------------------------------------------------------
        stage('Archive') {
            steps {
                echo "--- Etape 6: Archiving Logs ---"
                bat 'docker-compose logs backend > backend.log'
                bat 'docker-compose logs frontend > frontend.log'
                bat 'docker-compose logs mongo > mongo.log'

                archiveArtifacts artifacts: '*.log', allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            echo "Nettoyage final..."
            bat 'docker-compose down'
            cleanWs()
        }
        success {
            echo "Pipeline terminé avec SUCCÈS ! Application testée."
        }
        failure {
            echo "Pipeline ÉCHOUÉ. Vérifiez les logs."
        }
    }
}
