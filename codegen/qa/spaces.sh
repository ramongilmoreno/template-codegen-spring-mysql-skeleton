#!/bin/bash

echo "Cleaning tabs, trailing spaces and trailing lines of files not in .gitignore"
echo

# List all files not .gitignore-d and of type text
# http://stackoverflow.com/a/39064584/1898234
FILES=`( git status --short| grep '^?' | cut -d\  -f2- && git ls-files ) | sort -u | ( xargs -d '\n' -- stat -c'%F %n' 2>/dev/null  ||: ) | grep '^regular file' | sed 's/^regular file //' | xargs -d '\n' -- file | awk -v FS=: '$2~/text/ { print $1 }'`

# Observe spaces in filenames
# https://www.cyberciti.biz/tips/handling-filenames-with-spaces-in-bash.html
SAVEIFS=$IFS
IFS=$(echo -en "\n\b")

TEMPFILE=`mktemp`

for f in $FILES
do
   echo "Cleaning $f"
   #           Expanding tabs: http://www.computerhope.com/unix/uexpand.htm
   #    Remove traling spaces: http://stackoverflow.com/questions/4438306/how-to-remove-trailing-whitespaces-with-sed
   #  Removing trailing lines: http://stackoverflow.com/a/23894449/1898234
   # Adding a new line at EOF: http://unix.stackexchange.com/a/31955
   #                           (adding a new line at end is mandatory or tac will ignore the last line witouth CRLF)
   expand --tabs=4 "$f" | sed -e '$a\' | sed 's/[ ]*$//' | tac | sed -e '/./,$!d' | tac > $TEMPFILE
   cp -f $TEMPFILE "$f"
done

rm $TEMPFILE
IFS=$SAVEIFS
