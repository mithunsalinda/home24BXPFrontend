import '../CustomeWidgets/LastModifiedWidget.scss';
const LastModifiedWidget: React.FC<{ product: any }> = ({ product }) => {
  if (!product) return null;

  return (
    <>
      <h3 className="widgetHeader">Last Modified Product</h3>
      <div className="lastModifiedWidget">
        <div className="productImage">
          {product.picture?.[0]?.startsWith('data:image') && (
            <img src={product.picture[0]} alt="product" className="imageThumb" />
          )}
        </div>
        <div className="productDetails">
          <p>
            <strong>Name:</strong> {product.name}
          </p>
          <p>
            <strong>Category:</strong> {product.category}
          </p>
        </div>
        <div className="productDetails">
          <p>
            <strong>Price:</strong> ${product.price}
          </p>
          <p>
            <strong>Last Modified:</strong> {new Date(product.lastModified).toLocaleString()}
          </p>
        </div>
      </div>
    </>
  );
};

export default LastModifiedWidget;
