import React, {useState, useCallback} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Button,
  FlatList,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import useZebraScanner from 'react-native-scanner-zebra-enhanced';
import ProductCard from './ProductCard';

interface ScannedItem {
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
}

const App: React.FC = (): React.JSX.Element => {
  const [scannedData, setScannedData] = useState<ScannedItem[]>([]);
  const [scanners, setScanners] = useState<{id: number; name: string}[]>([]);
  const [scannerEnabled, setScannerEnabled] = useState<boolean>(false);
  const [barcodeInput, setBarcodeInput] = useState<string>('');

  const onScan = useCallback((barcode: string, scannerId: string) => {
    console.log(`Barcode scanned: ${barcode}, Scanner ID: ${scannerId}`);
    fetchProductInfo(barcode, scannerId);
  }, []);

  const onEvent = useCallback((event: string, scannerId: string) => {
    console.log(`Event: ${event}, Scanner ID: ${scannerId}`);
  }, []);

  const {setEnabled, getActiveScanners} = useZebraScanner(onScan, onEvent);

  const handleEnableScanner = () => {
    setEnabled(true);
    setScannerEnabled(true);
    console.log('Scanner enabled');
  };

  const handleDisableScanner = () => {
    setEnabled(false);
    setScannerEnabled(false);
    console.log('Scanner disabled');
  };

  const fetchScanners = () => {
    getActiveScanners(activeScanners => {
      console.log('Active scanners:', activeScanners);
      setScanners(activeScanners);
    });
  };

  const handleBarcodeInputChange = (text: string) => {
    setBarcodeInput(text);
  };

  const handleAddBarcodeManually = async () => {
    if (barcodeInput.trim()) {
      const scannerId = 'manual-entry';
      await fetchProductInfo(barcodeInput, scannerId);
      setBarcodeInput('');
    } else {
      Alert.alert('Error', 'Please enter a valid barcode');
    }
  };

  const fetchProductInfo = async (barcode: string, scannerId: string) => {
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
      );
      const data = await response.json();

      if (data.status === 1 && data.product) {
        const {
          product_name,
          brands,
          quantity,
          ingredients_text,
          image_url,
          nutriments,
        } = data.product;
        setScannedData(prevData => [
          ...prevData,
          {
            barcode,
            scannerId,
            productName: product_name || 'Unknown Product',
            productImage: image_url || '',
            brand: brands || 'Unknown Brand',
            quantity: quantity || 'Unknown Quantity',
            ingredients: ingredients_text || 'Unknown Ingredients',
            nutritionalInfo: {
              energy: nutriments?.energy || 'Not available',
              fat: nutriments?.fat || 'Not available',
              saturatedFat: nutriments?.saturated_fat || 'Not available',
              carbohydrates: nutriments?.carbohydrates || 'Not available',
              sugars: nutriments?.sugars || 'Not available',
              fiber: nutriments?.fiber || 'Not available',
              proteins: nutriments?.proteins || 'Not available',
              salt: nutriments?.salt || 'Not available',
            },
          },
        ]);
        Alert.alert(
          'Success',
          `Barcode: ${barcode} added. Product: ${
            product_name || 'Unknown Product'
          }`,
        );
      } else {
        Alert.alert('Error', 'Product not found');
      }
    } catch (error) {
      console.error('Error fetching product info:', error);
      Alert.alert('Error', 'Failed to fetch product information');
    }
  };

  const handleRemoveItem = (barcode: string) => {
    setScannedData(prevData =>
      prevData.filter(item => item.barcode !== barcode),
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={{padding: 20, flex: 1}}>
          <Text>Hello</Text>
          <Button title="Enable Scanner" onPress={handleEnableScanner} />
          <Button title="Disable Scanner" onPress={handleDisableScanner} />
          <Button title="Fetch Active Scanners" onPress={fetchScanners} />

          <Text style={{marginTop: 20, fontSize: 18}}>
            Scanner Status: {scannerEnabled ? 'Enabled' : 'Disabled'}
          </Text>

          <TextInput
            value={barcodeInput}
            onChangeText={handleBarcodeInputChange}
            placeholder="Enter barcode"
            style={{
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              marginTop: 20,
            }}
          />
          <Button
            title="Add Barcode Manually"
            onPress={handleAddBarcodeManually}
          />

          <Text style={{marginTop: 20, fontSize: 18}}>Scanned Items:</Text>
          <FlatList
            data={scannedData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <ProductCard
                barcode={item.barcode}
                scannerId={item.scannerId}
                productName={item.productName}
                productImage={item.productImage}
                brand={item.brand}
                quantity={item.quantity}
                ingredients={item.ingredients}
                nutritionalInfo={item.nutritionalInfo}
                onRemove={handleRemoveItem}
              />
            )}
          />

          <Text style={{marginTop: 20, fontSize: 18}}>Active Scanners:</Text>
          <FlatList
            data={scanners}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <Text>{`Scanner ID: ${item.id}, Name: ${item.name}`}</Text>
            )}
            ListFooterComponent={<View style={{height: 20}} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
