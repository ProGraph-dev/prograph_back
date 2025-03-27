pipeline {
    agent any

    triggers {
        GenericTrigger(
            token: 'prograph-back-token'
        )
    }

    environment {
        APP_PORT = '4000'
        NEXT_HOST = '0.0.0.0'
        RUN_USER = 'prograph'
        PROJECT_DIR = '/home/prograph/Desktop/ProGraph/ProGraph-Back'
        NVM_DIR = '/home/prograph/.nvm'
    }

    stages {
        stage('Stop Process') {
            steps {
                script {
                    def pid = sh(script: "lsof -t -i:4000 || true", returnStdout: true).trim()
                    if (pid) {
                        echo "Stopping process with PID: ${pid} on port 4000"
                        sh "kill -9 ${pid}"
                    } else {
                        echo "No process found running on port 4000"
                    }
                }
            }
        }

        stage('Remove Directory if Exists') {
            steps {
                script {
                    def dirPath = '/home/prograph/Desktop/ProGraph/ProGraph-Back'

                    def exists = sh(script: "test -d ${dirPath} && echo 'exists' || echo 'not exists'", returnStdout: true).trim()
                    echo "Checking existence of directory: ${dirPath}, Found: ${exists}"
                    sh "echo 1-${pwd}"
                    if (exists == 'exists') {
                        try {
                            sh "rm -rf ${dirPath}/*"
                            echo "Successfully removed directory: ${dirPath}"
                        } catch (Exception e) {
                            echo "Failed to remove directory: ${dirPath}"
                            echo "Error: ${e.getMessage()}"
                            currentBuild.result = 'FAILURE'
                        }
                    } else {
                        sh '''
                            mkdir -p /home/prograph/Desktop/ProGraph/ProGraph-Back
                        '''
                        echo "Directory does not exist: ${dirPath}"
                    }
                }
            }
        }

        stage('Move Folders') {
            steps {
                script {
                    def branchName = env.GIT_BRANCH ?: sh(script: 'git rev-parse --abbrev-ref HEAD', returnStdout: true).trim()
                    if (branchName == 'origin/dev') {
                        sh '''
                            mv * /home/prograph/Desktop/ProGraph/ProGraph-Back/
                        '''
                    } else {
                        error("Build stopped because the branch is not 'dev'.")
                    }
                }
            }
        }

        stage('Build & Run') {
            steps {
                script {
                    def branchName = env.GIT_BRANCH ?: sh(script: 'git rev-parse --abbrev-ref HEAD', returnStdout: true).trim()
                    echo "Current branch: ${branchName}"

                    if (branchName == 'origin/dev') {
                        script {
                            sh '''
                                sudo -u ${RUN_USER} bash -i -c "
                                export NVM_DIR=${NVM_DIR}
                                [ -s \"$NVM_DIR/nvm.sh\" ] && . \"$NVM_DIR/nvm.sh\"
        
                                nvm install 20.10.0
                                nvm use 20.10.0
        
                                cd ${PROJECT_DIR}
                                ls -la  # Проверяем, есть ли package.json
                                npm install
                                npm run build
                                "
            
                                sudo -u ${RUN_USER} bash -i -c "
                                export NVM_DIR=${NVM_DIR}
                                [ -s \"$NVM_DIR/nvm.sh\" ] && . \"$NVM_DIR/nvm.sh\"
        
                                export PORT=${APP_PORT}
                                export HOST=${NEXT_HOST}
        
                                cd ${PROJECT_DIR}
                                pm2 delete prograph_website || true
                                pm2 start npm --name prograph_back -- run start -- -p ${APP_PORT} -H ${NEXT_HOST}
                                pm2 save
                                pm2 list
                                "
                            '''
                        }
                    } else {
                        echo "Skipping build and run because the branch is not 'dev'."
                    }
                }
            }
        }
    }

    post {
        success {
            script {
                def branchName = env.GIT_BRANCH ?: sh(script: 'git rev-parse --abbrev-ref HEAD', returnStdout: true).trim()
                if (branchName == 'origin/dev') {
                    def curlCmd = '''curl -X POST -H "Content-Type: application/json" -d '{"chat_id": "-4518758992", "text": "[🎉SUCCESS] Backend build succeeded! 🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉", "disable_notification": false}' https://api.telegram.org/bot7541177344:AAHjoqOz59t31P202BUzQ5agy-ViEYp2uAY/sendMessage'''
                    def response = sh(script: curlCmd, returnStdout: true).trim()
                    echo "Curl command output: ${response}"
                }
            }
        }
        failure {
            script {
                def branchName = env.GIT_BRANCH ?: sh(script: 'git rev-parse --abbrev-ref HEAD', returnStdout: true).trim()
                if (branchName == 'origin/dev') {
                    def curlCmd = '''curl -X POST -H "Content-Type: application/json" -d '{"chat_id": "-4518758992", "text": "[💀FAILED] Backend build failed😭😭😭😭😭😭😭😭😭😭😭😭😭😭😭!", "disable_notification": false}' https://api.telegram.org/bot7541177344:AAHjoqOz59t31P202BUzQ5agy-ViEYp2uAY/sendMessage'''
                    def response = sh(script: curlCmd, returnStdout: true).trim()
                    echo "Curl command output: ${response}"
                }
            }
        }
    }
}
