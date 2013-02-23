function login(userId) {
  $.ajax({
    type: "post",
    dataType: "json",
    data: {'username' : userId},
    url: "/login",
    success: function (data) { // On success, route to new page using username
      window.location.replace(URLLLLLLLLL)
    },
  });
}