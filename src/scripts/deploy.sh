#!/bin/bash

# Проверяем переданы ли аргументы
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <project_folder_name> <github_repo>"
    exit 1
fi

# Имя проекта в pm2
PROJECT_NAME="$1"

# Путь к папке проекта
PROJECT_PATH="$HOME/git/$PROJECT_NAME"

# GitHub репозиторий проекта
GITHUB_REPO="https://github.com/$2.git"

# Лог-файл
LOG_FILE="$PROJECT_PATH/deployment.log"

# Функция для установки зависимостей и запуска проекта
install_and_run_project() {
    echo "🛠 Cloning project from GitHub...\n"
    git clone $GITHUB_REPO $PROJECT_PATH

    cd $PROJECT_PATH

    echo "🛠 Installing dependencies...\n"
    npm install

    echo "🛠 Starting project with pm2...\n"
    pm2 start npm --name $PROJECT_NAME -- run autodeploy-gh
    pm2 restart $PROJECT_NAME --restart-delay=60000

    echo "🛠 Deployment successful. Project is up and running!\n"
}

# Функция для обновления проекта и зависимостей, а затем его перезапуска
update_and_restart_project() {
    cd $PROJECT_PATH

    echo "🛠 Stopping project with pm2...\n"
    pm2 stop $PROJECT_NAME

    echo "🛠 Pulling latest changes from GitHub...\n"
    git pull

    echo "🛠 Installing updated dependencies...\n"
    npm install

    echo "🛠 Starting project with pm2...\n"
    pm2 start $PROJECT_NAME --restart-delay=60000

    echo "🛠 Deployment successful. Project is up and running!\n"
}

# Перенаправляем весь вывод в файл
{
    # Проверяем наличие папки проекта
    if [ -d "$PROJECT_PATH" ]; then
        update_and_restart_project
    else
        install_and_run_project
    fi
} | tee -a $LOG_FILE
