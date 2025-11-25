import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class AdminHome extends StatelessWidget {
  const AdminHome({super.key});

  Stream<QuerySnapshot<Map<String, dynamic>>> _usersStream() {
    return FirebaseFirestore.instance
        .collection('users')
        .orderBy('createdAt', descending: true)
        .snapshots();
  }

  Future<void> _updateUserRole(
    BuildContext context,
    String userId,
    String newRole,
  ) async {
    await FirebaseFirestore.instance
        .collection('users')
        .doc(userId)
        .update({
      'role': newRole,
      'updatedAt': FieldValue.serverTimestamp(),
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Rol actualizado a $newRole')),
    );
  }

  Future<void> _updatePremium(
    BuildContext context,
    String userId,
    bool isPremium,
  ) async {
    await FirebaseFirestore.instance
        .collection('users')
        .doc(userId)
        .update({
      'isPremium': isPremium,
      'updatedAt': FieldValue.serverTimestamp(),
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          isPremium ? 'Usuario marcado como Premium' : 'Usuario sin Premium',
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('MarketPet - Admin'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => FirebaseAuth.instance.signOut(),
          ),
        ],
      ),
      body: StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
        stream: _usersStream(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          final docs = snapshot.data?.docs ?? [];

          if (docs.isEmpty) {
            return const Center(
              child: Text('No hay usuarios registrados aún.'),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(8),
            itemCount: docs.length,
            itemBuilder: (context, index) {
              final userDoc = docs[index];
              final data = userDoc.data();
              final email = (data['email'] ?? '').toString();
              final role = (data['role'] ?? 'cliente').toString();
              final isPremium = (data['isPremium'] ?? false) as bool;

              return Card(
                child: ListTile(
                  title: Text(email.isEmpty ? '(sin email)' : email),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Rol: $role'),
                      Text('Premium: ${isPremium ? "Sí" : "No"}'),
                    ],
                  ),
                  trailing: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      DropdownButton<String>(
                        value: role,
                        underline: const SizedBox.shrink(),
                        items: const [
                          DropdownMenuItem(
                            value: 'cliente',
                            child: Text('Cliente'),
                          ),
                          DropdownMenuItem(
                            value: 'proveedor',
                            child: Text('Proveedor'),
                          ),
                          DropdownMenuItem(
                            value: 'admin',
                            child: Text('Admin'),
                          ),
                        ],
                        onChanged: (value) {
                          if (value != null) {
                            _updateUserRole(context, userDoc.id, value);
                          }
                        },
                      ),
                      const SizedBox(height: 4),
                      InkWell(
                        onTap: () =>
                            _updatePremium(context, userDoc.id, !isPremium),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Checkbox(
                              value: isPremium,
                              onChanged: (value) {
                                if (value != null) {
                                  _updatePremium(
                                      context, userDoc.id, value);
                                }
                              },
                            ),
                            const Text('Premium'),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
