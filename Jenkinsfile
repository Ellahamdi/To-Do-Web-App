pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "todo_project"
    }

    stages {

        // STAGE 1: Checkout
        stage('Checkout') {
            steps {
                echo "--- Etape 1: Checkout ---"
                checkout scm
            }
        }

        // STAGE 2: Setup
        stage('Setup') {
            steps {
                echo "--- Etape 2: Setup & Clean ---"
                script {
                    bat 'docker-compose --version'
                    bat 'docker-compose down --volumes --remove-orphans || exit 0'
                    bat 'docker rm -f todo-frontend todo-backend todo-mongo || exit 0'
                }
            }
        }

        // STAGE 3: Build
        stage('Build') {
            steps {
                echo "--- Etape 3: Build Images ---"
                bat 'docker-compose build'
            }
        }

        // STAGE 4: Run
        stage('Run (Docker)') {
            steps {
                echo "--- Etape 4: Run Containers ---"
                bat 'docker-compose up -d'
                // sleep 15 removed → we now wait properly in the next stage
            }
        }

        // STAGE 5: Smoke Test ← FIXED & RELIABLE NOW
        stage('Smoke Test') {
            steps {
                echo "--- Etape 5: Smoke Tests ---"
                script {
                    // Wait for backend (max 90 seconds)
                    timeout(time: 90, unit: 'SECONDS') {
                        waitUntil {
                            script {
                                def result = bat(script: """
                                    powershell -Command "
                                        try {
                                            \$resp = Invoke-WebRequest http://localhost:8000 -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
                                            if (\$resp.StatusCode -eq 200) { exit 0 } else { exit 1 }
                                        } catch { exit 1 }
                                    "
                                """, returnStatus: true)
                                return (result == 0)
                            }
                        }
                    }

                    // Wait for frontend (max 60 seconds)
                    timeout(time: 60, unit: 'SECONDS') {
                        waitUntil {
                            script {
                                def result = bat(script: """
                                    powershell -Command "
                                        try {
                                            Invoke-WebRequest http://localhost:3000 -UseBasicParsing -Method HEAD -TimeoutSec 10 -ErrorAction Stop | Out-Null
                                            exit 0
                                        } catch { exit 1 }
                                    "
                                """, returnStatus: true)
                                return (result == 0)
                            }
                        }
                    }

                    echo "Smoke Tests validés : Les ports 3000 et 8000 répondent correctement !"
                }
            }
        }

        // STAGE 6: Archive (unchanged)
        stage('Archive') {
            steps {
                echo "--- Etape 6: Archiving Logs ---"
                bat 'docker-compose logs backend > backend.log || exit 0'
                bat 'docker-compose logs frontend > frontend.log || exit 0'
                bat 'docker-compose logs mongo > mongo.log || exit 0'

                archiveArtifacts artifacts: "*.log", allowEmptyArchive: true
            }
        }

    }  // end stages

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