import React from 'react';
import {View, Text, Image, Button, StyleSheet} from 'react-native';

interface ProductCardProps {
  barcode: string;
  scannerId: string;
  productName?: string;
  productImage?: string;
  brand?: string;
  quantity?: string;
  ingredients?: string;
  nutritionalInfo?: {
    energy?: string;
    fat?: string;
    saturatedFat?: string;
    carbohydrates?: string;
    sugars?: string;
    fiber?: string;
    proteins?: string;
    salt?: string;
  };
  onRemove: (barcode: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  barcode,
  scannerId,
  productName = 'Unknown Product',
  productImage,
  brand = 'Unknown Brand',
  quantity = 'Unknown Quantity',
  ingredients = 'Unknown Ingredients',
  nutritionalInfo = {},
  onRemove,
}) => {
  return (
    <View style={styles.card}>
      {productImage ? (
        <Image source={{uri: productImage}} style={styles.image} />
      ) : (
        <Text>No Image Available</Text>
      )}
      <Text style={styles.productName}>{productName}</Text>
      <Text>Barcode: {barcode}</Text>
      <Text>Scanner ID: {scannerId}</Text>
      <Text>Brand: {brand}</Text>
      <Text>Quantity: {quantity}</Text>
      <Text>Ingredients: {ingredients}</Text>
      <Text>Nutritional Information:</Text>
      <Text>Energy: {nutritionalInfo.energy || 'Not available'}</Text>
      <Text>Fat: {nutritionalInfo.fat || 'Not available'}</Text>
      <Text>
        Saturated Fat: {nutritionalInfo.saturatedFat || 'Not available'}
      </Text>
      <Text>
        Carbohydrates: {nutritionalInfo.carbohydrates || 'Not available'}
      </Text>
      <Text>Sugars: {nutritionalInfo.sugars || 'Not available'}</Text>
      <Text>Fiber: {nutritionalInfo.fiber || 'Not available'}</Text>
      <Text>Proteins: {nutritionalInfo.proteins || 'Not available'}</Text>
      <Text>Salt: {nutritionalInfo.salt || 'Not available'}</Text>
      <Button title="Remove" onPress={() => onRemove(barcode)} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductCard;
