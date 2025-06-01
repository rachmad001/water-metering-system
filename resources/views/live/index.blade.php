<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Image Viewer</title>
    <script>
        var counting = 0;
        function refreshImage() {
            counting++;
            var img = document.getElementById("liveImage");
            img.src = "Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/live.jpg?t=" + counting;
        }

        setInterval(refreshImage, 1000); // Refresh every 3 seconds
    </script>
</head>
<body>
    <h2>Live Image Viewer</h2>
    <img id="liveImage" src="/myfiles/live.jpg" alt="Live Image">
</body>
</html>
