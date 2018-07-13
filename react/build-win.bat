IF EXIST "build" (
    rmdir "build" /s /q
)

mkdir "build/assets"
xcopy src/assets build/ /s /e
npm run build-only