@REM Maven Wrapper for Windows
@REM https://maven.apache.org/wrapper/
@echo off
setlocal

set WRAPPER_JAR="%~dp0.mvn\wrapper\maven-wrapper.jar"
set WRAPPER_PROPERTIES="%~dp0.mvn\wrapper\maven-wrapper.properties"

if not exist %WRAPPER_JAR% (
    echo Maven wrapper jar not found. Please run: mvn wrapper:wrapper
    exit /b 1
)

"%JAVA_HOME%\bin\java.exe" %MAVEN_OPTS% ^
    -jar %WRAPPER_JAR% ^
    %*
