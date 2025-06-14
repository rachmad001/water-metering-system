run following command:

#create storage for 10gb storage
truncate -s 10G project.img

#create images for storage
mkfs.ext4 project.img

#Create a mount point directory
sudo mkdir -p /mnt/vscode_project

#Mount the image file to that directory using a loop device
sudo mount -o loop ./project.img /mnt/vscode_project

Give your own user ownership of the mounted directory. This is important so Docker can interact with it properly
sudo chown -R $USER:$USER /mnt/vscode_project