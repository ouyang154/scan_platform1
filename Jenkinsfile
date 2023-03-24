pipeline
{
    agent any

    stages
    {       
        stage('Package')
        {
            steps
            {
                sh 'sudo rm -rf ./*.deb /tmp/cytovue_package'
                sh './make_pack.sh'
            }
        }
    
    } // stages

    post
    {
        always
        {
            archiveArtifacts artifacts: '*.deb', fingerprint: true
        }
    }
}