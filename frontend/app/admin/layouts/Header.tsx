export default function Header() {
  const toggleMenu = () => {
    let toggleMenu = document.querySelector('.app-aside');
    const headerMenu = document.querySelector('.header-menu-icon');
    if (toggleMenu && headerMenu) {
      toggleMenu.classList.toggle('active');
      headerMenu.classList.toggle('active');
    }
  };

  return (
    <header className="app-header">
      <div className="app-header-container">
        <div className="header-left">
          <div className="header-menu-icon" onClick={toggleMenu}>
            <i className="fa-light fa-bars-sort"></i>
          </div>
        </div>
      </div>
    </header>
  );
}
