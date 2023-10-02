export { Favorites, FavoritesView }

// classe que vai conter a lógica dos dados
// como os dados serão estruturados
class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
  }
}


// classe que vai criar a visualização eeventos do HTML
class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    console.log(this.root)
    // this.update()
  }

  update() {
    this.removeAlltr()
  }

  removeAlltr() {
    const tbody = this.root.querySelector('table tbody')

    tbody.querySelectorAll('tr')
      .forEach((tr) => {
        tr.remove()
      })
  }
}