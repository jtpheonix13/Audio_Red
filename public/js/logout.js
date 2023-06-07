const logout = async () => {
  try {
    await Promise.all([
      fetch('/api/users/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }),
      fetch('/api/users/home/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    ]);

    document.location.replace('/');
  } catch (error) {
    console.log(error);
    alert('An error occurred during logout. Please try again.');
  }
};

document.querySelector('#logout').addEventListener('click', logout);
