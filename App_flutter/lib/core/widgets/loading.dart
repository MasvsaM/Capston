import 'package:flutter/material.dart';
import '../constants/app_strings.dart';
import '../constants/text_styles.dart';

class LoadingIndicator extends StatelessWidget {
  final String message;

  const LoadingIndicator({super.key, this.message = AppStrings.loading});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const CircularProgressIndicator(),
          const SizedBox(height: 16),
          Text(message, style: AppTextStyles.body),
        ],
      ),
    );
  }
}
