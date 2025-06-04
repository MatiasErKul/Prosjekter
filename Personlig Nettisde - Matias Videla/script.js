function openProjectModal(projectUrl) {
    const modal = document.getElementById('projectModal');
    const iframe = document.getElementById('projectFrame');
    iframe.src = projectUrl;
    modal.style.display = 'block';
}
  
document.querySelector('.close-button').onclick = function () {
    document.getElementById('projectModal').style.display = 'none';
    document.getElementById('projectFrame').src = '';
};
  
window.onclick = function(event) {
    const modal = document.getElementById('projectModal');
    if (event.target == modal) {
      modal.style.display = 'none';
      document.getElementById('projectFrame').src = '';
    }
};
  