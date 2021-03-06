var post = [];

document.addEventListener('paste', function(e){
	var resourceLink = "/file";

	if (e.clipboardData) {
		var items = e.clipboardData.items;
		if (items) {
			for (var i = 0; i < items.length; i++) {
				if (items[i].type.indexOf("image") !== -1) {
					var blob = items[i].getAsFile();
					var URLObj = window.URL || window.webkitURL;
					var source = URLObj.createObjectURL(blob);

					// Create new image
					var pastedImage = new Image();
					pastedImage.onload = function () {
						var canvas = document.createElement('canvas');
						document.body.appendChild(canvas);

						canvas.width = pastedImage.width;
						canvas.height = pastedImage.height;
						canvas.style = "border:1px solid grey;";
						canvas.getContext('2d').drawImage(pastedImage, 0, 0);
					};
					pastedImage.src = source;

					// Upload the image
					var formData = new FormData(); 
					formData.append('file', blob);

					var xhr = new XMLHttpRequest();

					xhr.onreadystatechange = function() {
						if (xhr.readyState == 4) {
							var json = JSON.parse(xhr.responseText);
							console.log("Response id: ", json.id);
							post.push(json.id);
						}
					};

					xhr.open('POST', resourceLink, true);
					xhr.setRequestHeader('X_FILENAME', blob.name);
					xhr.send(formData);
				}
			}
			e.preventDefault();
		}
	}
}, false);

window.onload = function() {
	var input = document.getElementById("name");
	input.addEventListener('keyup', function(e) {
		var resourceLink = "/createpost";

		if(e.keyCode == 13) {
			var xhr = new XMLHttpRequest();

			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					window.location.href = xhr.responseText;
				}
			};

			xhr.open('POST', resourceLink, true);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.send(JSON.stringify({
				name: input.value,
				images: post
			}));

			input.value = "";
		};
	});
}