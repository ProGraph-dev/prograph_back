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
                    def branch = currentBuild.projectName

                    try{
                        sh "pm2 delete ${branch}_back"
                        sh "sudo mv dist /home/prograph/Desktop/ProGraph/prograph_back"
                    }
                    catch(Exception e){}

                    sh "pm2 start ./dist/main.js --name ${branch}_back"
                }
            }   
        }
    }

    post {
        success {
            script {
                sh "curl -X POST -H \"Content-Type: application/json\" -d \"{\\\"chat_id\\\":"4225385520", \\\"text\\\": \\\"[🎉SUCCESS] Backend build succeeded! 🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉\\\", \\\"disable_notification\\\": false}\" https://api.telegram.org/bot7541177344:AAHjoqOz59t31P202BUzQ5agy-ViEYp2uAY/sendMessage"
            }
        }
        failure {
            script {
                sh "curl -X POST -H \"Content-Type: application/json\" -d \"{\\\"chat_id\\\":"4225385520", \\\"text\\\": \\\"[💀FAILED] Backend build failed😭😭😭😭😭😭😭😭😭😭😭😭😭😭😭!\\\", \\\"disable_notification\\\": false}\" https://api.telegram.org/bot7541177344:AAHjoqOz59t31P202BUzQ5agy-ViEYp2uAY/sendMessage"
            }
        }
    }
}
