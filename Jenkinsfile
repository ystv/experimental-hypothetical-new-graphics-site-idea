@Library('ystv-jenkins')

def imageTag = ''
pipeline {
  agent {
    node {
      label 'docker && ramdisk'
      customWorkspace '/mnt/ramdisk/build/workspace/graphics'
    }
  }

  environment {
    DOCKER_BUILDKIT = "1"
  }

  stages {
    stage('Prepare') {
      steps {
        ciSkip action: 'check'
        script {
          def imageNamePrefix = ''
          if (env.BRANCH_NAME != 'main') {
            imageNamePrefix = "${env.BRANCH_NAME}-"
          }
          imageTag = "${imageNamePrefix.replace('/', '--')}${env.BUILD_NUMBER}"
        }
      }
    }

    stage('Build Images') {
      steps {
        sh """docker build \\
          --build-arg GIT_REV=${env.GIT_COMMIT} \\
          --build-arg VERSION=${env.TAG_NAME ?: 'v0.0.0'} \\
          -t registry.comp.ystv.co.uk/ystv/graphics:${imageTag}\\
          .
        """
      }
    }

    stage('Push') {
      when {
        anyOf {
          branch 'main'
          tag 'v*'
          changeRequest target: 'main'
        }
      }
      steps {
        dockerPush image: 'registry.comp.ystv.co.uk/ystv/graphics', tag: imageTag
      }
    }

    // stage('Deploy preview') {
    //   when {
    //     changeRequest target: 'main'
    //   }
    //   steps {
    //     deployPreview action: 'deploy', job: 'internal-site-preview', urlSuffix: 'internal.dev.ystv.co.uk'
    //   }
    // }

    stage('Deploy to development') {
      when {
        branch 'main'
      }
      steps {
        build job: 'Deploy Nomad Job', parameters: [
          string(name: 'JOB_FILE', value: 'graphics-dev.nomad'),
          text(name: 'TAG_REPLACEMENTS', value: "registry.comp.ystv.co.uk/ystv/graphics:${imageTag}")
        ], wait: true
        deployPreview action: 'cleanup'
        deployPreview action: 'cleanupMerge'
        // sh "nomad alloc exec -task graphics-dev -job graphics-dev npx -y prisma migrate deploy --schema lib/db/schema.prisma"
      }
    }

    stage('Deploy to production') {
      when {
        // Only build tags that look like v1.2.3 with no suffix (eg v1.2.3-beta.1 won't be built)
        tag(pattern: /^v\d+\.\d+\.\d+$/, comparator: "REGEXP")
      }
      steps {
        build job: 'Deploy Nomad Job', parameters: [
          string(name: 'JOB_FILE', value: 'graphics-prod.nomad'),
          text(name: 'TAG_REPLACEMENTS', value: "registry.comp.ystv.co.uk/ystv/graphics:${imageTag}")
        ], wait: true
        // sh "nomad alloc exec -task graphics-prod -job graphics-prod npx -y prisma migrate deploy --schema lib/db/schema.prisma"
      }
    }
  }

  post {
    always {
      ciSkip action: 'postProcess'
      cleanWs()
    }
  }
}
