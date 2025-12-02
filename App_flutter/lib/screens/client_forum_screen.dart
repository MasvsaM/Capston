import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class ClientForumScreen extends StatefulWidget {
  const ClientForumScreen({super.key});

  @override
  State<ClientForumScreen> createState() => _ClientForumScreenState();
}

class _ClientForumScreenState extends State<ClientForumScreen> {
  final _auth = FirebaseAuth.instance;
  final _firestore = FirebaseFirestore.instance;

  Future<void> _showNewPostDialog() async {
    final titleController = TextEditingController();
    final contentController = TextEditingController();

    await showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          title: const Text('Nuevo tema'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: titleController,
                  decoration: const InputDecoration(
                    labelText: 'Título',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: contentController,
                  decoration: const InputDecoration(
                    labelText: 'Mensaje',
                    border: OutlineInputBorder(),
                  ),
                  maxLines: 4,
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(ctx).pop(),
              child: const Text('Cancelar'),
            ),
            ElevatedButton(
              onPressed: () async {
                final user = _auth.currentUser;
                if (user == null) return;

                final title = titleController.text.trim();
                final content = contentController.text.trim();
                if (title.isEmpty || content.isEmpty) return;

                await _firestore.collection('forum_posts').add({
                  'title': title,
                  'content': content,
                  'authorId': user.uid,
                  'authorName':
                      user.displayName ?? user.email ?? 'Usuario',
                  'createdAt': FieldValue.serverTimestamp(),
                  'updatedAt': FieldValue.serverTimestamp(),
                  'commentsCount': 0,
                });

                if (!mounted) return;
                Navigator.of(ctx).pop();
              },
              child: const Text('Publicar'),
            ),
          ],
        );
      },
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

    final uid = user.uid;
    final userDocStream =
        _firestore.collection('users').doc(uid).snapshots();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Foro Premium'),
      ),
      body: StreamBuilder<DocumentSnapshot<Map<String, dynamic>>>(
        stream: userDocStream,
        builder: (context, userSnap) {
          if (userSnap.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          final userData = userSnap.data?.data() ?? {};
          final isPremium = (userData['isPremium'] as bool?) ?? false;

          // 🔒 Bloqueo si no es Premium
          if (!isPremium) {
            return Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.lock_outline,
                    size: 48,
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'El foro es exclusivo para cuentas Premium.',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 16),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Hazte Premium para compartir experiencias, dudas y tips '
                    'con otros tutores y profesionales.',
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton.icon(
                    onPressed: () {
                      Navigator.of(context).pushNamed('/clientPremium');
                    },
                    icon: const Icon(Icons.workspace_premium),
                    label: const Text('Ver plan Premium'),
                  ),
                ],
              ),
            );
          }

          // ✅ Ya es Premium: mostramos los posts
          final postsStream = _firestore
              .collection('forum_posts')
              .orderBy('createdAt', descending: true)
              .snapshots();

          return StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
            stream: postsStream,
            builder: (context, postsSnap) {
              if (postsSnap.hasError) {
                return Center(
                  child: Text(
                    'Error al cargar el foro: ${postsSnap.error}',
                  ),
                );
              }
              if (postsSnap.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              }

              final docs = postsSnap.data?.docs ?? [];

              if (docs.isEmpty) {
                return const Center(
                  child: Padding(
                    padding: EdgeInsets.all(24),
                    child: Text(
                      'Aún no hay temas en el foro.\n'
                      'Sé la primera persona en compartir algo 🐾',
                      textAlign: TextAlign.center,
                    ),
                  ),
                );
              }

              return ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: docs.length,
                separatorBuilder: (_, __) => const SizedBox(height: 8),
                itemBuilder: (context, index) {
                  final doc = docs[index];
                  final data = doc.data();
                  final title = data['title'] as String? ?? '';
                  final content = data['content'] as String? ?? '';
                  final authorName =
                      data['authorName'] as String? ?? 'Usuario';
                  final commentsCount =
                      (data['commentsCount'] as int?) ?? 0;
                  final createdAt = data['createdAt'] as Timestamp?;
                  String dateText = '';
                  if (createdAt != null) {
                    final d = createdAt.toDate();
                    dateText =
                        '${d.day.toString().padLeft(2, '0')}/${d.month.toString().padLeft(2, '0')}/${d.year}';
                  }

                  return Card(
                    child: ListTile(
                      title: Text(
                        title,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (content.isNotEmpty)
                            Padding(
                              padding: const EdgeInsets.only(top: 4),
                              child: Text(
                                content,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          const SizedBox(height: 4),
                          Text(
                            '$authorName • $dateText',
                            style: const TextStyle(
                              fontSize: 11,
                              color: Colors.black54,
                            ),
                          ),
                          if (commentsCount > 0)
                            Padding(
                              padding: const EdgeInsets.only(top: 2),
                              child: Text(
                                '$commentsCount comentario(s)',
                                style: const TextStyle(
                                  fontSize: 11,
                                  color: Colors.black54,
                                ),
                              ),
                            ),
                        ],
                      ),
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => ForumPostDetailScreen(
                              postId: doc.id,
                              postTitle: title,
                            ),
                          ),
                        );
                      },
                    ),
                  );
                },
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showNewPostDialog,
        child: const Icon(Icons.add),
      ),
    );
  }
}

/// =======================
///  DETALLE DE POST + COMENTARIOS
/// =======================
class ForumPostDetailScreen extends StatefulWidget {
  final String postId;
  final String postTitle;

  const ForumPostDetailScreen({
    super.key,
    required this.postId,
    required this.postTitle,
  });

  @override
  State<ForumPostDetailScreen> createState() => _ForumPostDetailScreenState();
}

class _ForumPostDetailScreenState extends State<ForumPostDetailScreen> {
  final _auth = FirebaseAuth.instance;
  final _firestore = FirebaseFirestore.instance;
  final TextEditingController _commentController = TextEditingController();
  bool _sending = false;

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  Future<void> _sendComment() async {
    final user = _auth.currentUser;
    if (user == null) return;

    final text = _commentController.text.trim();
    if (text.isEmpty) return;

    setState(() => _sending = true);

    try {
      await _firestore.collection('forum_comments').add({
        'postId': widget.postId,
        'content': text,
        'authorId': user.uid,
        'authorName':
            user.displayName ?? user.email ?? 'Usuario',
        'createdAt': FieldValue.serverTimestamp(),
      });

      // Incrementar contador de comentarios
      await _firestore
          .collection('forum_posts')
          .doc(widget.postId)
          .update({
        'commentsCount': FieldValue.increment(1),
      });

      _commentController.clear();
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error al enviar comentario: $e'),
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _sending = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final commentsStream = _firestore
        .collection('forum_comments')
        .where('postId', isEqualTo: widget.postId)
        .orderBy('createdAt', descending: false)
        .snapshots();

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.postTitle),
      ),
      body: Column(
        children: [
          Expanded(
            child: StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
              stream: commentsStream,
              builder: (context, snapshot) {
                if (snapshot.hasError) {
                  return Center(
                    child: Text(
                      'Error al cargar comentarios: ${snapshot.error}',
                    ),
                  );
                }
                if (snapshot.connectionState ==
                    ConnectionState.waiting) {
                  return const Center(
                    child: CircularProgressIndicator(),
                  );
                }

                final docs = snapshot.data?.docs ?? [];

                if (docs.isEmpty) {
                  return const Center(
                    child: Text(
                      'Sé la primera persona en comentar 🐾',
                    ),
                  );
                }

                return ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: docs.length,
                  separatorBuilder: (_, __) =>
                      const SizedBox(height: 8),
                  itemBuilder: (context, index) {
                    final doc = docs[index];
                    final data = doc.data();
                    final content =
                        data['content'] as String? ?? '';
                    final authorName =
                        data['authorName'] as String? ?? 'Usuario';
                    final createdAt =
                        data['createdAt'] as Timestamp?;
                    String dateText = '';
                    if (createdAt != null) {
                      final d = createdAt.toDate();
                      dateText =
                          '${d.day.toString().padLeft(2, '0')}/${d.month.toString().padLeft(2, '0')}/${d.year}';
                    }

                    return Card(
                      child: ListTile(
                        title: Text(content),
                        subtitle: Text(
                          '$authorName • $dateText',
                          style: const TextStyle(
                            fontSize: 11,
                            color: Colors.black54,
                          ),
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 4, 16, 8),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _commentController,
                      decoration: const InputDecoration(
                        hintText: 'Escribe un comentario...',
                        border: OutlineInputBorder(),
                        isDense: true,
                      ),
                      minLines: 1,
                      maxLines: 3,
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton(
                    onPressed: _sending ? null : _sendComment,
                    icon: _sending
                        ? const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                            ),
                          )
                        : const Icon(Icons.send),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
