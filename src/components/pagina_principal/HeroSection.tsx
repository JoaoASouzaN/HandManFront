import bonecoImage from '../../assets/Boneco1.png' // importando a imagem

export const HeroSection = () => {
  return (
  <section className="hero">
      <div className="hero-text">
        <h2>Não faça você mesmo, encontre um profissional</h2>
        <div className="pesquisa">
          <input type="text" placeholder="O que procura?" />
          <button>🔍</button>
        </div>
        <div className="icons">
          <div>🔧 Marcenaria</div>
          <div>🪚 Carpintaria</div>
          <div>💡 Elétrica</div>
          <div>🧹 Limpeza</div>
          <div>🛠️ Jardinagem</div>
          <div>🚽 Encanamento</div>
        </div>
      </div>
      <img src={bonecoImage} alt="Handyman personagem" className="hero-image" />
    </section>
  );
};


