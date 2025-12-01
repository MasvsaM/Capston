import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:image_picker/image_picker.dart';

class ProviderCatalogScreen extends StatefulWidget {
  const ProviderCatalogScreen({super.key});

  @override
  State<ProviderCatalogScreen> createState() =>
      _ProviderCatalogScreenState();
}

class _ProviderCatalogScreenState extends State<ProviderCatalogScreen> {
  final _firestore = FirebaseFirestore.instance;
  final _auth = FirebaseAuth.instance;
  final _storage = FirebaseStorage.instance;
  final _imagePicker = ImagePicker();

  // Categorías del proveedor (guardadas en users/{uid}.productCategories)
  List<String> _categories = [];
  bool _loadingCategories = true;

  // Filtros
  String? _selectedCategoryFilter; // null = todas
  String _selectedSort = 'nameAsc'; // nameAsc, nameDesc, priceAsc, priceDesc, newest
  String? _selectedTagFilter; // null = todas

  @override
  void initState() {
    super.initState();
    _loadCategories();
  }

  Future<void> _loadCategories() async {
    final user = _auth.currentUser;
    if (user == null) {
      setState(() => _loadingCategories = false);
      return;
    }

    try {
      final doc =
          await _firestore.collection('users').doc(user.uid).get();
      final data = doc.data() ?? {};
      final raw = data['productCategories'] as List<dynamic>? ?? [];
      _categories = raw.cast<String>();
    } catch (_) {
      // Ignoramos error, solo no tendremos categorías
    }

    if (!mounted) return;
    setState(() => _loadingCategories = false);
  }

  Future<void> _addCategory() async {
    final user = _auth.currentUser;
    if (user == null) return;

    final controller = TextEditingController();

    final result = await showDialog<String>(
      context: context,
      builder: (dialogContext) {
        return AlertDialog(
          title: const Text('Nueva categoría'),
          content: TextField(
            controller: controller,
            decoration: const InputDecoration(
              labelText: 'Nombre de la categoría',
              border: OutlineInputBorder(),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(dialogContext).pop(),
              child: const Text('Cancelar'),
            ),
            ElevatedButton(
              onPressed: () {
                final name = controller.text.trim();
                if (name.isEmpty) return;
                Navigator.of(dialogContext).pop(name);
              },
              child: const Text('Guardar'),
            ),
          ],
        );
      },
    );

    final name = result?.trim();
    if (name == null || name.isEmpty) return;

    try {
      await _firestore.collection('users').doc(user.uid).update({
        'productCategories': FieldValue.arrayUnion([name]),
      });

      if (!mounted) return;
      setState(() {
        if (!_categories.contains(name)) {
          _categories.add(name);
        }
      });
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('No se pudo guardar la categoría: $e')),
      );
    }
  }

  Stream<QuerySnapshot<Map<String, dynamic>>> _productsStream(
      String providerId) {
    // Solo filtramos por providerId en Firestore
    // y después filtramos/ordenamos en memoria.
    return _firestore
        .collection('products')
        .where('providerId', isEqualTo: providerId)
        .snapshots();
  }

  Future<void> _showProductDialog(
      {DocumentSnapshot<Map<String, dynamic>>? doc}) async {
    final isEdit = doc != null;
    final data = doc?.data() ?? {};

    final nameController =
        TextEditingController(text: data['name'] as String? ?? '');
    final descriptionController =
        TextEditingController(text: data['description'] as String? ?? '');
    final priceController = TextEditingController(
      text: (data['price'] as num?)?.toString() ?? '',
    );
    final discountController = TextEditingController(
      text: (data['discountPercent'] as num?)?.toString() ?? '',
    );
    final stockController = TextEditingController(
      text: (data['stock'] as num?)?.toString() ?? '',
    );

    String? selectedCategory = data['category'] as String?;

    // Imágenes (lista de URLs)
    final List<String> imageUrls = [];
    final rawImages = data['images'];
    if (rawImages is List) {
      imageUrls.addAll(rawImages.cast<String>());
    } else {
      final single = data['imageUrl'] as String?;
      if (single != null && single.isNotEmpty) {
        imageUrls.add(single);
      }
    }

    // Tags
    final List<String> tags = [];
    final rawTags = data['tags'];
    if (rawTags is List) {
      tags.addAll(rawTags.cast<String>());
    }
    final tagController = TextEditingController();

    await showDialog(
      context: context,
      builder: (dialogContext) {
        final formKey = GlobalKey<FormState>();

        return StatefulBuilder(
          builder: (context, setStateDialog) {
            Future<void> pickAndUploadImage() async {
              final user = _auth.currentUser;
              if (user == null) return;

              final XFile? picked = await _imagePicker.pickImage(
                source: ImageSource.gallery,
                maxWidth: 1200,
                imageQuality: 85,
              );
              if (picked == null) return;

              try {
                final bytes = await picked.readAsBytes();
                final fileName =
                    '${DateTime.now().millisecondsSinceEpoch}_${picked.name}';

                final ref = _storage
                    .ref()
                    .child('product_images')
                    .child(user.uid)
                    .child(fileName);

                final uploadTask = await ref.putData(bytes);
                final url = await uploadTask.ref.getDownloadURL();

                setStateDialog(() {
                  imageUrls.add(url);
                });
              } catch (e, st) {
                // ignore: avoid_print
                print('Error al subir imagen: $e\n$st');
                if (!mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('No se pudo subir la imagen: $e')),
                );
              }
            }

            void addTag() {
              final text = tagController.text.trim();
              if (text.isEmpty) return;
              if (!tags.contains(text)) {
                setStateDialog(() {
                  tags.add(text);
                });
              }
              tagController.clear();
            }

            return AlertDialog(
              title: Text(
                  isEdit ? 'Editar producto' : 'Nuevo producto'),
              content: Form(
                key: formKey,
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      TextFormField(
                        controller: nameController,
                        decoration: const InputDecoration(
                          labelText: 'Nombre',
                          border: OutlineInputBorder(),
                        ),
                        validator: (value) {
                          if (value == null ||
                              value.trim().isEmpty) {
                            return 'Ingresa un nombre';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: descriptionController,
                        decoration: const InputDecoration(
                          labelText: 'Descripción',
                          border: OutlineInputBorder(),
                        ),
                        maxLines: 2,
                      ),
                      const SizedBox(height: 8),

                      // Categoría
                      if (_categories.isNotEmpty)
                        DropdownButtonFormField<String?>(
                          value: selectedCategory,
                          decoration: const InputDecoration(
                            labelText: 'Categoría',
                            border: OutlineInputBorder(),
                          ),
                          items: [
                            const DropdownMenuItem<String?>(
                              value: null,
                              child: Text('Sin categoría'),
                            ),
                            ..._categories.map(
                              (c) => DropdownMenuItem<String?>(
                                value: c,
                                child: Text(c),
                              ),
                            ),
                          ],
                          onChanged: (value) {
                            setStateDialog(() {
                              selectedCategory = value;
                            });
                          },
                        )
                      else
                        const Align(
                          alignment: Alignment.centerLeft,
                          child: Text(
                            'Aún no tienes categorías.\n'
                            'Puedes crearlas desde el catálogo.',
                          ),
                        ),
                      const SizedBox(height: 8),

                      TextFormField(
                        controller: priceController,
                        decoration: const InputDecoration(
                          labelText: 'Precio (CLP)',
                          border: OutlineInputBorder(),
                        ),
                        keyboardType: TextInputType.number,
                        validator: (value) {
                          if (value == null ||
                              value.trim().isEmpty) {
                            return 'Ingresa un precio';
                          }
                          final v = double.tryParse(
                              value.replaceAll(',', '.'));
                          if (v == null || v <= 0) {
                            return 'Precio inválido';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: discountController,
                        decoration: const InputDecoration(
                          labelText: 'Descuento % (opcional)',
                          border: OutlineInputBorder(),
                        ),
                        keyboardType: TextInputType.number,
                      ),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: stockController,
                        decoration: const InputDecoration(
                          labelText: 'Stock (opcional)',
                          border: OutlineInputBorder(),
                        ),
                        keyboardType: TextInputType.number,
                      ),
                      const SizedBox(height: 12),

                      // Tags
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          'Etiquetas (tags)',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Theme.of(context)
                                .colorScheme
                                .primary,
                          ),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: tagController,
                              decoration:
                                  const InputDecoration(
                                hintText:
                                    'Ej: gato, peluquería, delivery',
                                border: OutlineInputBorder(),
                              ),
                              onSubmitted: (_) => addTag(),
                            ),
                          ),
                          const SizedBox(width: 8),
                          IconButton(
                            icon: const Icon(Icons.add),
                            onPressed: addTag,
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Wrap(
                        spacing: 6,
                        runSpacing: 4,
                        children: tags
                            .map(
                              (tag) => Chip(
                                label: Text(tag),
                                onDeleted: () {
                                  setStateDialog(() {
                                    tags.remove(tag);
                                  });
                                },
                              ),
                            )
                            .toList(),
                      ),
                      const SizedBox(height: 12),

                      // Imágenes
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          'Imágenes',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Theme.of(context)
                                .colorScheme
                                .primary,
                          ),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          ...imageUrls.map(
                            (url) => Stack(
                              alignment: Alignment.topRight,
                              children: [
                                ClipRRect(
                                  borderRadius:
                                      BorderRadius.circular(8),
                                  child: Image.network(
                                    url,
                                    width: 70,
                                    height: 70,
                                    fit: BoxFit.cover,
                                  ),
                                ),
                                InkWell(
                                  onTap: () {
                                    setStateDialog(() {
                                      imageUrls.remove(url);
                                    });
                                  },
                                  child: Container(
                                    decoration:
                                        const BoxDecoration(
                                      color: Colors.black54,
                                      shape: BoxShape.circle,
                                    ),
                                    padding:
                                        const EdgeInsets.all(2),
                                    margin:
                                        const EdgeInsets.all(2),
                                    child: const Icon(
                                      Icons.close,
                                      size: 14,
                                      color: Colors.white,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          InkWell(
                            onTap: pickAndUploadImage,
                            child: Container(
                              width: 70,
                              height: 70,
                              decoration: BoxDecoration(
                                borderRadius:
                                    BorderRadius.circular(8),
                                border: Border.all(
                                    color: Colors.grey),
                              ),
                              child: const Icon(
                                Icons.add_a_photo_outlined,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () =>
                      Navigator.of(dialogContext).pop(),
                  child: const Text('Cancelar'),
                ),
                ElevatedButton(
                  onPressed: () async {
                    if (!formKey.currentState!.validate()) {
                      return;
                    }

                    final user = _auth.currentUser;
                    if (user == null) return;

                    final priceText = priceController.text
                        .trim()
                        .replaceAll(',', '.');
                    final price =
                        double.tryParse(priceText) ?? 0;

                    double? discount;
                    final discountText =
                        discountController.text.trim();
                    if (discountText.isNotEmpty) {
                      final d = double.tryParse(
                          discountText.replaceAll(',', '.'));
                      if (d != null) {
                        discount =
                            d.clamp(0, 100).toDouble();
                      }
                    }

                    int? stock;
                    final stockText =
                        stockController.text.trim();
                    if (stockText.isNotEmpty) {
                      final s = int.tryParse(stockText);
                      if (s != null && s >= 0) {
                        stock = s;
                      }
                    }

                    final payload = <String, dynamic>{
                      'providerId': user.uid,
                      'name': nameController.text.trim(),
                      'description':
                          descriptionController.text.trim(),
                      'price': price,
                      'discountPercent': discount,
                      'images': imageUrls,
                      'stock': stock,
                      'category': selectedCategory,
                      'tags': tags,
                      'isActive': true,
                      'updatedAt': FieldValue.serverTimestamp(),
                    };

                    if (isEdit) {
                      await doc!.reference.update(payload);
                    } else {
                      payload['createdAt'] =
                          FieldValue.serverTimestamp();
                      await _firestore
                          .collection('products')
                          .add(payload);
                    }

                    if (mounted) {
                      Navigator.of(dialogContext).pop();
                    }
                  },
                  child: const Text('Guardar'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  Future<void> _deleteProduct(
      DocumentReference<Map<String, dynamic>> ref) async {
    await ref.delete();
  }

  Widget _buildFilters() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
      child: Row(
        children: [
          Expanded(
            child: DropdownButtonFormField<String?>(
              value: _selectedCategoryFilter,
              decoration: const InputDecoration(
                labelText: 'Categoría',
                border: OutlineInputBorder(),
                isDense: true,
              ),
              items: [
                const DropdownMenuItem<String?>(
                  value: null,
                  child: Text('Todas'),
                ),
                ..._categories.map(
                  (c) => DropdownMenuItem<String?>(
                    value: c,
                    child: Text(c),
                  ),
                ),
              ],
              onChanged: (value) {
                setState(() {
                  _selectedCategoryFilter = value;
                });
              },
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: DropdownButtonFormField<String>(
              value: _selectedSort,
              decoration: const InputDecoration(
                labelText: 'Ordenar por',
                border: OutlineInputBorder(),
                isDense: true,
              ),
              items: const [
                DropdownMenuItem(
                  value: 'nameAsc',
                  child: Text('Nombre (A-Z)'),
                ),
                DropdownMenuItem(
                  value: 'nameDesc',
                  child: Text('Nombre (Z-A)'),
                ),
                DropdownMenuItem(
                  value: 'priceAsc',
                  child: Text('Precio menor'),
                ),
                DropdownMenuItem(
                  value: 'priceDesc',
                  child: Text('Precio mayor'),
                ),
                DropdownMenuItem(
                  value: 'newest',
                  child: Text('Más recientes'),
                ),
              ],
              onChanged: (value) {
                if (value == null) return;
                setState(() {
                  _selectedSort = value;
                });
              },
            ),
          ),
          const SizedBox(width: 4),
          IconButton(
            tooltip: 'Nueva categoría',
            onPressed: _addCategory,
            icon: const Icon(Icons.category),
          ),
        ],
      ),
    );
  }

  Widget _buildTagFilter(List<String> tags) {
    if (tags.isEmpty) {
      return const SizedBox.shrink();
    }

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 0),
      child: Row(
        children: [
          FilterChip(
            label: const Text('Todas las etiquetas'),
            selected: _selectedTagFilter == null,
            onSelected: (_) {
              setState(() => _selectedTagFilter = null);
            },
          ),
          const SizedBox(width: 8),
          ...tags.map(
            (tag) => Padding(
              padding: const EdgeInsets.only(right: 8),
              child: FilterChip(
                label: Text(tag),
                selected: _selectedTagFilter == tag,
                onSelected: (selected) {
                  setState(() {
                    _selectedTagFilter = selected ? tag : null;
                  });
                },
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = _auth.currentUser;
    if (user == null) {
      return const Scaffold(
        body: Center(child: Text('Debes iniciar sesión.')),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Catálogo de productos'),
      ),
      body: Column(
        children: [
          if (!_loadingCategories) _buildFilters(),
          if (_loadingCategories)
            const Padding(
              padding: EdgeInsets.all(12),
              child: LinearProgressIndicator(),
            ),
          Expanded(
            child: StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
              stream: _productsStream(user.uid),
              builder: (context, snapshot) {
                if (snapshot.hasError) {
                  return Center(
                    child: Text(
                      'Error al cargar productos: ${snapshot.error}',
                    ),
                  );
                }
                if (snapshot.connectionState ==
                    ConnectionState.waiting) {
                  return const Center(
                      child: CircularProgressIndicator());
                }

                var docs =
                    snapshot.data?.docs.toList() ?? [];

                // Todas las etiquetas disponibles
                final allTagsSet = <String>{};
                for (final d in docs) {
                  final data = d.data();
                  final t =
                      (data['tags'] as List<dynamic>?)
                              ?.cast<String>() ??
                          [];
                  allTagsSet.addAll(t);
                }
                final allTags =
                    allTagsSet.toList()..sort();

                // Filtro por categoría y tag
                docs = docs.where((doc) {
                  final data = doc.data();

                  if (_selectedCategoryFilter != null) {
                    final category =
                        data['category'] as String? ?? '';
                    if (category !=
                        _selectedCategoryFilter) {
                      return false;
                    }
                  }

                  if (_selectedTagFilter != null &&
                      _selectedTagFilter!
                          .trim()
                          .isNotEmpty) {
                    final tags =
                        (data['tags'] as List<dynamic>?)
                                ?.cast<String>() ??
                            [];
                    if (!tags.contains(
                        _selectedTagFilter)) {
                      return false;
                    }
                  }

                  return true;
                }).toList();

                // Ordenamiento
                docs.sort((a, b) {
                  final da = a.data();
                  final db = b.data();

                  switch (_selectedSort) {
                    case 'priceAsc':
                      final pa =
                          (da['price'] as num?)
                                  ?.toDouble() ??
                              0;
                      final pb =
                          (db['price'] as num?)
                                  ?.toDouble() ??
                              0;
                      return pa.compareTo(pb);
                    case 'priceDesc':
                      final pa =
                          (da['price'] as num?)
                                  ?.toDouble() ??
                              0;
                      final pb =
                          (db['price'] as num?)
                                  ?.toDouble() ??
                              0;
                      return pb.compareTo(pa);
                    case 'nameDesc':
                      final na =
                          (da['name'] as String? ?? '')
                              .toLowerCase();
                      final nb =
                          (db['name'] as String? ?? '')
                              .toLowerCase();
                      return nb.compareTo(na);
                    case 'newest':
                      final ta =
                          da['createdAt']
                              as Timestamp?;
                      final tb =
                          db['createdAt']
                              as Timestamp?;
                      final va = ta
                              ?.toDate()
                              .millisecondsSinceEpoch ??
                          0;
                      final vb = tb
                              ?.toDate()
                              .millisecondsSinceEpoch ??
                          0;
                      return vb.compareTo(va);
                    case 'nameAsc':
                    default:
                      final na =
                          (da['name'] as String? ?? '')
                              .toLowerCase();
                      final nb =
                          (db['name'] as String? ?? '')
                              .toLowerCase();
                      return na.compareTo(nb);
                  }
                });

                return Column(
                  children: [
                    _buildTagFilter(allTags),
                    const SizedBox(height: 4),
                    Expanded(
                      child: docs.isEmpty
                          ? const Center(
                              child: Text(
                                'No hay productos con el filtro actual.\n'
                                'Usa el botón + para agregar uno.',
                                textAlign: TextAlign.center,
                              ),
                            )
                          : ListView.separated(
                              padding:
                                  const EdgeInsets.all(16),
                              itemCount: docs.length,
                              separatorBuilder: (_, __) =>
                                  const SizedBox(
                                      height: 8),
                              itemBuilder:
                                  (context, index) {
                                final doc = docs[index];
                                final data = doc.data();
                                final name =
                                    data['name']
                                            as String? ??
                                        '';
                                final description =
                                    data['description']
                                            as String? ??
                                        '';
                                final price =
                                    (data['price']
                                                as num?)
                                            ?.toDouble() ??
                                        0;
                                final discount =
                                    (data['discountPercent']
                                                as num?)
                                            ?.toDouble();
                                final images = (data['images']
                                            as List<
                                                dynamic>?)
                                        ?.cast<String>() ??
                                    [];
                                final imageUrl = images
                                        .isNotEmpty
                                    ? images.first
                                    : (data['imageUrl']
                                            as String? ??
                                        '');
                                final stock =
                                    (data['stock']
                                            as num?)
                                        ?.toInt();
                                final category =
                                    data['category']
                                            as String? ??
                                        '';
                                final tags =
                                    (data['tags']
                                                as List<
                                                    dynamic>?)
                                            ?.cast<
                                                String>() ??
                                        [];

                                final discountedPrice =
                                    (discount != null)
                                        ? price *
                                            (1 -
                                                discount /
                                                    100)
                                        : null;

                                return Card(
                                  child: ListTile(
                                    leading: imageUrl
                                            .isNotEmpty
                                        ? CircleAvatar(
                                            backgroundImage:
                                                NetworkImage(
                                                    imageUrl),
                                            onBackgroundImageError:
                                                (_, __) {},
                                          )
                                        : const CircleAvatar(
                                            child: Icon(Icons
                                                .inventory_2),
                                          ),
                                    title: Text(name),
                                    subtitle: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment
                                              .start,
                                      children: [
                                        if (description
                                            .isNotEmpty)
                                          Text(
                                              description),
                                        if (category
                                            .isNotEmpty)
                                          Text(
                                            'Categoría: $category',
                                            style:
                                                const TextStyle(
                                              fontSize: 12,
                                              color: Colors
                                                  .black54,
                                            ),
                                          ),
                                        const SizedBox(
                                            height: 4),
                                        if (discount !=
                                                null &&
                                            discountedPrice !=
                                                null)
                                          Text(
                                            '\$${discountedPrice.toStringAsFixed(0)}  '
                                            '(${price.toStringAsFixed(0)} - '
                                            '${discount!.toStringAsFixed(0)}%)',
                                          )
                                        else
                                          Text(
                                            '\$${price.toStringAsFixed(0)}',
                                          ),
                                        if (stock != null)
                                          Text(
                                              'Stock: $stock'),
                                        if (tags.isNotEmpty)
                                          Padding(
                                            padding:
                                                const EdgeInsets
                                                    .only(
                                                    top:
                                                        4),
                                            child: Wrap(
                                              spacing: 4,
                                              runSpacing: 2,
                                              children: tags
                                                  .map(
                                                    (t) =>
                                                        Chip(
                                                      label:
                                                          Text(
                                                        t,
                                                        style:
                                                            const TextStyle(fontSize: 11),
                                                      ),
                                                      visualDensity:
                                                          VisualDensity.compact,
                                                      materialTapTargetSize:
                                                          MaterialTapTargetSize.shrinkWrap,
                                                    ),
                                                  )
                                                  .toList(),
                                            ),
                                          ),
                                      ],
                                    ),
                                    trailing: Row(
                                      mainAxisSize:
                                          MainAxisSize.min,
                                      children: [
                                        IconButton(
                                          icon: const Icon(
                                              Icons.edit),
                                          onPressed: () =>
                                              _showProductDialog(
                                                  doc:
                                                      doc),
                                        ),
                                        IconButton(
                                          icon: const Icon(
                                              Icons.delete),
                                          onPressed: () =>
                                              _deleteProduct(
                                                  doc.reference),
                                        ),
                                      ],
                                    ),
                                  ),
                                );
                              },
                            ),
                    ),
                  ],
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showProductDialog(),
        child: const Icon(Icons.add),
      ),
    );
  }
}
