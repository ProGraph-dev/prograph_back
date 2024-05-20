pipeline {
    agent any

    triggers {
        GenericTrigger(
            token: 'ProGraph' 
        )
    }
    
    stages {
        stage('Build') {
            steps {
                sh "npm i"
                sh "npm run build"
                sh "dirname /home/ag/Desktop/Projects/ProGraph/prograph_back/dist"
            }
        }

        stage('Run') {
            steps {
                script {
                    def branch = currentBuild.projectName

                    try{
                        sh "pm2 delete ${branch}_back"
                        sh "mv dist /home/ag/Desktop/Projects/ProGraph/prograph_back"
                    }
                    catch(Exception e){}

                    sh "ls -la"
                    sh "cd /home/ag/Desktop/Projects/ProGraph/prograph_back/dist"
                    sh "pm2 start /home/ag/Desktop/Projects/ProGraph/prograph_back/dist/main.js --name ${branch}_back"
                }
            }   
        }
    }
}
