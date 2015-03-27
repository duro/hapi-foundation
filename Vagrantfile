ENV['VAGRANT_DEFAULT_PROVIDER'] = 'docker'
ENV["DOCKER_HOST_VAGRANT_FILE"] ||= "./docker/Dockerhost"
ENV["DOCKER_HOST_VAGRANT_NAME"] ||= "zg-site-docker-host"

# BUILD ALL WITH: vagrant up --no-parallel

Vagrant.configure("2") do |config|

  config.vm.define "mongodb" do |v|

    v.vm.provider "docker" do |d|
      d.vagrant_machine = ENV["DOCKER_HOST_VAGRANT_NAME"]
      d.vagrant_vagrantfile = ENV["DOCKER_HOST_VAGRANT_FILE"]
      d.image = "mongo:2.6.7"
      d.name = "vt_mongodb"
      d.remains_running = true
    end
  end

  config.vm.define "app" do |v|

    v.vm.synced_folder ".", "/opt/app", type: "rsync",
      rsync__exclude: get_ignored_files()

    v.vm.provider "docker" do |d|
      d.vagrant_machine = ENV["DOCKER_HOST_VAGRANT_NAME"]
      d.vagrant_vagrantfile = ENV["DOCKER_HOST_VAGRANT_FILE"]
      d.build_dir = "."
      d.build_args = ['--tag="vtapp/api"']
      d.remains_running = true
      d.ports = ["8000:8000", "8080:8080", "5858:5858"]
      d.link("vt_mongodb:mongodb")
    end
  end

end

def get_ignored_files()
  ignore_file   = ".rsyncignore"
  ignore_array  = []

  if File.exists? ignore_file and File.readable? ignore_file
    File.read(ignore_file).each_line do |line|
      ignore_array << line.chomp
    end
  end

  return ignore_array
end
