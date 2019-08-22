CREATE TABLE `tbl_sms` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `to` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '接收人',
  `content` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` tinyint(3) unsigned NOT NULL COMMENT '1 验证码',
  `expire` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
