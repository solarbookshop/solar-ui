import com.github.gradle.node.NodeExtension
import com.github.gradle.node.npm.task.NpmInstallTask
import com.github.gradle.node.npm.task.NpxTask

plugins {
  id("com.github.node-gradle.node") version "7.1.0"
}

the<NodeExtension>().apply {
  version.set("26.4.0")
  npmVersion.set("11.16.0")
  download.set(true)
}

group = "com.solarbookshop"
version = "0.0.1-SNAPSHOT"
description = "Front end for the Solar Bookshop application"

tasks.register<NpxTask>("lintAngular") {
  description = "Lint the Angular source files"
  command.set("ng")
  args.set(listOf("lint"))
  dependsOn(tasks.named<NpmInstallTask>("npmInstall"))
  inputs.dir("src")
  inputs.dir("node_modules")
  inputs.files(
    "angular.json",
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.spec.json",
    "tslint.json"
  )
  outputs.upToDateWhen { true }
}

tasks.register<NpxTask>("testAngular") {
  description = "Run Angular unit tests"
  command.set("ng")
  args.set(listOf("test"))
  dependsOn(tasks.named<NpmInstallTask>("npmInstall"))
  inputs.dir("src")
  inputs.dir("node_modules")
  inputs.files(
    "angular.json",
    "tsconfig.json",
    "tsconfig.spec.json"
  )
  outputs.upToDateWhen { true }
}

tasks.register<NpxTask>("buildAngular") {
  description = "Build the Angular application for production"
  command.set("ng")
  args.set(listOf("build"))
  dependsOn(tasks.named<NpmInstallTask>("npmInstall"))
  inputs.dir(project.fileTree("src").apply { exclude("**/*.spec.ts") })
  inputs.dir("node_modules")
  inputs.files(
    "angular.json",
    "tsconfig.json",
    "tsconfig.app.json"
  )
  finalizedBy("nginxConfig")
}

tasks.register<Copy>("nginxConfig") {
  description = "Copy Nginx configuration into the dist directory"
  from("nginx")
  into("dist")
}

tasks.register<Delete>("clean") {
  description = "Delete the dist build output directory"
  delete("dist")
}
