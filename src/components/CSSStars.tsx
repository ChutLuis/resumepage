const CSSStars = () => {
  return (
    <div className="w-full h-auto absolute inset-0 z-[-1] overflow-hidden">
      <div className="stars-layer-1"></div>
      <div className="stars-layer-2"></div>
      <div className="stars-layer-3"></div>
      <style>{`
        .stars-layer-1,
        .stars-layer-2,
        .stars-layer-3 {
          position: absolute;
          width: 100%;
          height: 100%;
          background-repeat: repeat;
        }

        .stars-layer-1 {
          background-image: radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 60px 70px, #fff, rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 50px 50px, #fff, rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 130px 80px, #fff, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 90px 10px, #fff, rgba(0,0,0,0));
          background-size: 200px 200px;
          animation: stars-drift 240s linear infinite;
        }

        .stars-layer-2 {
          background-image: radial-gradient(1px 1px at 40px 60px, #fff, rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 110px 90px, #fff, rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 160px 40px, #fff, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 70px 120px, #f272c8, rgba(0,0,0,0));
          background-size: 200px 200px;
          animation: stars-drift 180s linear infinite reverse;
          opacity: 0.8;
        }

        .stars-layer-3 {
          background-image: radial-gradient(1px 1px at 80px 10px, #fff, rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 20px 100px, #fff, rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 150px 70px, #f272c8, rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 100px 140px, #fff, rgba(0,0,0,0));
          background-size: 200px 200px;
          animation: stars-drift 300s linear infinite;
          opacity: 0.6;
        }

        @keyframes stars-drift {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-200px);
          }
        }
      `}</style>
    </div>
  );
};

export default CSSStars;
