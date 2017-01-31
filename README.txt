Setup:

    Pre-requisites

        Linux:

            This project was built on Linux.

            Ubuntu 16.04 LTS in particular.

    Setup:

        Install Git 2.7.4:

            See: https://git-scm.com/download/linux

        Install Docker 1.12.3:

            See: https://www.docker.com/products/overview

        Install Node.js 6.2.1 or later (use nvm utility to manage Node versions in your system):

            See: https://github.com/creationix/nvm

        Install Gulp globally. This will let you run main project tasks from any directory within the solution:

            See:

                https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md

            Command:

                $ npm install --global gulp-cli

        Install Node packages with npm:

            $ npm install

        No need to install MySQL:

            Will be run from a Docker container

        Ensure Java 1.8 and Maven 3.3 are properly setup on your system.

            These are pre-requisites in the exercise.

            Will not describe the installation process further.

        Optional: install IDE

            Recommended:

                Spring Tool Suite:

                    https://spring.io/tools


To run the application:

    Open a new terminal to run the MySQL server with:

        $ gulp mysql:start

    Start the application with:

        $ gulp run

    The entry point is in port 8080:

        http://127.0.0.1:8080

        Credentials are:

            username: admin
            password: admin

    An alternative way to start the application is to directly invoke the .jar:

        $ cd dev
        $ mvn package
        $ ./run.sh


Mac OS X incompatibilities:

    This is a list of incompatibilities found in Mac OS X:

        * In script codegen/qa/spaces.sh, the 'xargs -d' option is used (to specify delimiter of xargs input). This option is GNU xargs specific. Does not appear in Mac xargs.
