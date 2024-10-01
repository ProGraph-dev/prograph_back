pipeline {
    agent any

    triggers {
        GenericTrigger(
            token: 'prograph-back-token' 
        )
    }
    
    stages {
        stage('Build') {
            steps {
                sh "npm i"
                sh "npm run build"
                sh "dirname /home/prograph/Desktop/ProGraph/prograph_back/dist"
            }
        }

        stage('Run') {
            steps {
                script {
                    try{
                        sh "pwd"
                        sh "pm2 delete prograph_back"
                        sh "cp -r dist prograph_back"
                    }
                    catch(Exception e){}

                    sh "pm2 start ./dist/main.js --name prograph_back"
                }
            }   
        }
    }

    post {
        success {
            script {
                def curlCmd = '''curl -X POST -H "Content-Type: application/json" -d '{"chat_id": "-4518758992", "text": "[🎉SUCCESS] Backend build succeeded! 🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉", "disable_notification": false}' https://api.telegram.org/bot7541177344:AAHjoqOz59t31P202BUzQ5agy-ViEYp2uAY/sendMessage'''
                def response = sh(script: curlCmd, returnStdout: true).trim()
                echo "Curl command output: ${response}"
            }
        }
        failure {
            script {
                // 4225385520
                def curlCmd = '''curl -X POST -H "Content-Type: application/json" -d '{"chat_id": "-4518758992", "text": "[💀FAILED] Backend build failed😭😭😭😭😭😭😭😭😭😭😭😭😭😭😭!", "disable_notification": false}' https://api.telegram.org/bot7541177344:AAHjoqOz59t31P202BUzQ5agy-ViEYp2uAY/sendMessage'''
                def response = sh(script: curlCmd, returnStdout: true).trim()
                echo "Curl command output: ${response}"
            }
        }
    }
}
