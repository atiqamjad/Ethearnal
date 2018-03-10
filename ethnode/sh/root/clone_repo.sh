#!/usr/bin/env bash
set -x
curr_branch=`git branch | grep "*"`
curr_branch=${curr_branch:2}
cwd_dir=`pwd`
repo_name="Ethearnal"
clone_url="https://github.com/Ethearnal/Ethearnal.git"

echo "curwrd: ${cwd_dir} \n"
echo "reponm: ${repo_name} \n"


string=${cwd_dir}
substring=${repo_name}

#thanks to http://timmurphy.org/2013/05/13/string-contains-substring-in-bash/

if [[ "$string" == *"$substring"* ]]; then
    echo "'$string' contains '$substring'";
    echo "won't clonehere:"
else
    echo "'$string' does not contain '$substring'";
    echo "start clone here:"
    echo "${cwd_dir}"
    git clone ${clone_url}
    cd ${repo_name}
    git fetch
    git checkout ${curr_branch}
fi
set +x